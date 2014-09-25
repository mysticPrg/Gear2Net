package net.gear2net.api.util.keyboard;

import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.event.G2NEventListenerGroup;
import net.gear2net.framework.object.G2NObject;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

public class G2NKeyboard extends G2NObject
{

	/**
	 * "Enum Value" = null
	 */

	final private Lock mLock = new ReentrantLock();
	private Context mContext = null;

	public static final String G2NKEYBOARD_ACTION = "G2NKEYBOARD_ACTION";

	private G2NEventListenerGroup mListeners = null;
	private BroadcastReceiver mGetTextReceiver = null;

	static public G2NKeyboard mInst = null;

	static public G2NKeyboard getInstance(Context context)
	{
		if ( mInst == null )
		{
			mInst = new G2NKeyboard(context);
		}
		return mInst;
	}

	private G2NKeyboard(Context context)
	{
		mLock.lock();
		this.mContext = context;

		mListeners = new G2NEventListenerGroup(G2NEventListenerGroup.EmptyCreator, G2NEventListenerGroup.EmptyDestroyer);

		mGetTextReceiver = new BroadcastReceiver()
		{
			@Override
			public void onReceive(Context context, Intent intent)
			{
				if ( intent.getBooleanExtra("isCancel", true) == false )
				{
					String text = intent.getStringExtra("text");
					Vector<Object> args = new Vector<Object>();
					args.add(text);
					mListeners.onEvent(args);
				}
				mListeners.onDestroy();
			}
		};
		IntentFilter filter = new IntentFilter(G2NKEYBOARD_ACTION);
		mContext.registerReceiver(mGetTextReceiver, filter);
		mLock.unlock();
	}

	public void getText(G2NEventListener listener)
	{
		mLock.lock();

		mListeners.addListener(listener);

		Intent intent = new Intent(mContext.getApplicationContext(), PopupActivity.class);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		mContext.startActivity(intent);

		mLock.unlock();
	}
}
