package net.gear2net.framework.service;

import net.gear2net.framework.DebugLog;
import net.gear2net.framework.G2NWidget.WidgetType;
import net.gear2net.framework.msgqueue.G2NSystemQueue;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import com.samsung.android.sdk.SsdkUnsupportedException;
import com.samsung.android.sdk.accessory.SA;
import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;

public class WatchWidgetSAAgent extends SAAgent
{

	private static final String TAG = "WatchWidgetSAAgent";
	private static final int SYSTEM_QUEUE_CAPACITY = 20;

	private G2NSystemQueue mSystemQueue = null;
	private WatchWidgetSASocket mSocket = null;

	public WatchWidgetSAAgent()
	{
		super(TAG, WatchWidgetSASocket.class);
	}

	@Override
	public void onCreate()
	{
		super.onCreate();
		DebugLog.onDebugMode();

		DebugLog.log("WatchWidgetSAAgent create!!!");
		SA mAccessory = new SA();

		try
		{
			mAccessory.initialize(this);
			mSystemQueue = new G2NSystemQueue(this, WidgetType.WATCH, SYSTEM_QUEUE_CAPACITY);
			mSystemQueue.start();
		} catch (InstantiationException e)
		{
			e.printStackTrace();
			stopSelf();
		} catch (IllegalAccessException e)
		{
			e.printStackTrace();
			stopSelf();
		} catch (SsdkUnsupportedException e)
		{
			e.printStackTrace();
			stopSelf();
		} catch (Exception e)
		{
			e.printStackTrace();
			stopSelf();
		}

	}

	@Override
	protected void onFindPeerAgentResponse(SAPeerAgent peerAgent, int result)
	{
		DebugLog.log("onFindPeerAgentResponse  result =" + result);
	}

	@Override
	protected void onServiceConnectionResponse(SASocket socket, int result)
	{
		switch ( result )
		{
			case CONNECTION_SUCCESS:
				if ( socket != null )
				{
					mSocket = (WatchWidgetSASocket) socket;
					mSocket.setSystemQueue(mSystemQueue);
				}
				break;

			case CONNECTION_ALREADY_EXIST:
				DebugLog.log("onServiceConnectionResponse: " + "CONNECTION_ALREADY_EXIST");
				break;

			default:
				DebugLog.log("onServiceConnectionResponse: resultError=" + result);
				break;
		}

	}

	@Override
	protected void onServiceConnectionRequested(SAPeerAgent peerAgent)
	{
		acceptServiceConnectionRequest(peerAgent);
	}

	private final IBinder mBinder = new Binder()
	{
		@SuppressWarnings("unused")
		public WatchWidgetSAAgent getService()
		{
			return WatchWidgetSAAgent.this;
		}
	};

	@Override
	public IBinder onBind(Intent intent)
	{
		return mBinder;
	}

}
