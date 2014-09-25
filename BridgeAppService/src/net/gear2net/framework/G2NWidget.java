package net.gear2net.framework;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.audio.G2NAudio;
import net.gear2net.api.mobile.battery.G2NBattery;
import net.gear2net.api.mobile.sensor.G2NSensorManager;
import net.gear2net.api.mobile.vibrate.G2NVibrate;
import net.gear2net.api.mobile.wifi.G2NWifi;
import net.gear2net.api.util.keyboard.G2NKeyboard;
import net.gear2net.api.util.log.G2NLog;
import net.gear2net.api.util.webviewer.G2NWebViewer;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.event.G2NEventListenerGroup;
import net.gear2net.framework.msg.receive.ReceiveMsg;
import net.gear2net.framework.msg.receive.StatusMsg;
import net.gear2net.framework.msgqueue.G2NRequestQueue;
import net.gear2net.framework.msgqueue.G2NSystemQueue;
import net.gear2net.framework.object.G2NObject;
import android.content.Context;

import com.samsung.android.sdk.accessory.SASocket;

public class G2NWidget
{
	public enum WidgetType
	{
		NORMAL, WATCH
	}

	public G2NRequestQueue mRequestQueue = null;
	private String mWID = null;
	private WidgetType mType;
	private Map<String, G2NObject> mObjTable = null;
	private Context mContext = null;
	private boolean mIsPause = false;

	private Map<String, G2NEventListener> mEventListeners = null;

	private ReentrantLock mLock = null;

	public G2NWidget(Context context, SASocket socket, G2NSystemQueue sysQueue, String wID, WidgetType type, int countOfThread, int queueCapacity) throws InstantiationException,
			IllegalAccessException
	{
		mWID = wID;
		mType = type;
		mContext = context;

		mLock = new ReentrantLock();

		mObjTable = new HashMap<String, G2NObject>();
		putSingletonClassToObjTable();

		mEventListeners = new HashMap<String, G2NEventListener>();

		mRequestQueue = new G2NRequestQueue(this, sysQueue, countOfThread, queueCapacity);
		mRequestQueue.setSocket(socket);
		mRequestQueue.start();
	}

	public String getWID()
	{
		return mWID;
	}

	public WidgetType getType()
	{
		return mType;
	}

	public boolean containsObject(String objKey)
	{
		return mObjTable.containsKey(objKey);
	}

	public G2NObject getObject(String objKey)
	{
		return mObjTable.get(objKey);
	}

	public void putObject(String objKey, G2NObject obj)
	{
		mObjTable.put(objKey, obj);
	}

	private String createUUID()
	{
		String uuid = UUID.randomUUID().toString();
		return uuid.replaceAll("-", "").substring(0, 10);
	}

	public String putObject(G2NObject obj)
	{
		String objKey = createUUID();
		while (mObjTable.containsKey(objKey) == true)
		{
			objKey = createUUID();
		}

		putObject(objKey, obj);

		return objKey;
	}

	public void removeObject(String objKey)
	{
		mObjTable.remove(objKey);
	}

	public void sendMsg(ReceiveMsg msg) throws InterruptedException
	{
		mLock.lock();
		msg.setWidget(this);
		mRequestQueue.put(msg);
		mLock.unlock();
	}

	public void resume()
	{
		mLock.lock();
		if ( mIsPause == true )
		{
			mIsPause = false;
			mRequestQueue.resume();
		}
		mLock.unlock();
	}

	public void pause() throws InterruptedException
	{
		mLock.lock();
		if ( mIsPause == false )
		{
			mIsPause = true;
			mRequestQueue.pause();
		}
		mLock.unlock();
	}

	public void destroy(StatusMsg msg) throws InterruptedException
	{
		mLock.lock();
		Set<Entry<String, G2NEventListener>> set = mEventListeners.entrySet();
		for ( Entry<String, G2NEventListener> item : set )
		{
			G2NEventListenerGroup g = item.getValue().getGroup();
			if ( g != null )
			{
				g.onDestroy();
			}
		}
		mEventListeners.clear();
		mRequestQueue.destroy(msg);
		mLock.unlock();
	}

	public boolean isPause()
	{
		return mIsPause;
	}

	public void addEventListener(String listenerKey, G2NEventListener listener)
	{
		mEventListeners.put(listenerKey, listener);
	}

	public void removeEventListener(String listenerKey)
	{
		mEventListeners.remove(listenerKey);
	}

	private void putSingletonClassToObjTable()
	{
		mObjTable.put(G2NAudio.class.getName(), G2NAudio.getInstance(mContext));
		mObjTable.put(G2NBattery.class.getName(), G2NBattery.getInstance(mContext));
		mObjTable.put(G2NSensorManager.class.getName(), G2NSensorManager.getInstance(mContext));
		mObjTable.put(G2NVibrate.class.getName(), G2NVibrate.getInstance(mContext));
		mObjTable.put(G2NWifi.class.getName(), G2NWifi.getInstance(mContext));
		mObjTable.put(G2NKeyboard.class.getName(), G2NKeyboard.getInstance(mContext));
		mObjTable.put(G2NLog.class.getName(), G2NLog.getInstance(mContext));
		mObjTable.put(G2NWebViewer.class.getName(), G2NWebViewer.getInstance(mContext));
		mObjTable.put(G2NContext.class.getName(), G2NContext.getInstance(mContext));
	}
}
