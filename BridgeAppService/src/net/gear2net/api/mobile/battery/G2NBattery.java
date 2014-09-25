package net.gear2net.api.mobile.battery;

import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.event.G2NEventCreator;
import net.gear2net.framework.event.G2NEventDestroyer;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.event.G2NEventListenerGroup;
import net.gear2net.framework.object.G2NObject;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

public class G2NBattery extends G2NObject
{

	/**
	 * "Enum Value" = null
	 */

	static private G2NBattery mInst = null;

	static public G2NBattery getInstance(Context context)
	{

		if ( mInst == null )
		{
			mInst = new G2NBattery(context);
		}
		return mInst;
	}

	private Lock mLock = new ReentrantLock();
	private Context mContext = null;

	private float mCurrentPercentage = 0.0f;
	private G2NEventListenerGroup mBatteryChangedListeners = null;
	private BroadcastReceiver mBatteryLevelReceiver = null;

	private G2NBattery(Context context)
	{

		mLock.lock();

		mBatteryChangedListeners = new G2NEventListenerGroup(new G2NEventCreator()
		{
			@Override
			public void onCreate()
			{
				IntentFilter batteryLevelFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
				mContext.registerReceiver(mBatteryLevelReceiver, batteryLevelFilter);
			}
		}, new G2NEventDestroyer()
		{
			@Override
			public void onDestroy()
			{
				mContext.unregisterReceiver(mBatteryLevelReceiver);
				mCurrentPercentage = 0.0f;
			}
		});

		this.mContext = context;

		mBatteryLevelReceiver = new BroadcastReceiver()
		{
			@Override
			public void onReceive(Context context, Intent intent)
			{

				int currentLevel = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
				int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

				if ( currentLevel >= 0 && scale > 0 )
				{
					mCurrentPercentage = (currentLevel * 100) / scale;

					Vector<Object> args = new Vector<Object>();
					args.add(mCurrentPercentage);

					mBatteryChangedListeners.onEvent(args);
				}
			}
		};
		mLock.unlock();
	}

	public void addBatteryChangedListener(G2NEventListener listener)
	{
		mBatteryChangedListeners.addListener(listener);
	}

	public void removeBatteryChangedListener(String listenerKey)
	{
		mBatteryChangedListeners.removeListener(listenerKey);
	}
}
