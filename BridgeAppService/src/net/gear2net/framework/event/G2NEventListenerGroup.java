package net.gear2net.framework.event;

import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class G2NEventListenerGroup
{
	static public G2NEventCreator EmptyCreator = new G2NEventCreator()
	{
		@Override
		public void onCreate()
		{
		}
	};

	static public G2NEventDestroyer EmptyDestroyer = new G2NEventDestroyer()
	{
		@Override
		public void onDestroy()
		{
		}
	};

	private Vector<G2NEventListener> mListeners;
	private Lock mLock = null;
	private G2NEventCreator mCreator = null;
	private G2NEventDestroyer mDestroyer = null;

	private boolean isCreated = false;

	public G2NEventListenerGroup(G2NEventCreator creator, G2NEventDestroyer destroyer)
	{
		mListeners = new Vector<G2NEventListener>();
		mLock = new ReentrantLock();
		mCreator = creator;
		mDestroyer = destroyer;
	}

	public void onEvent(Vector<Object> args)
	{
		mLock.lock();
		for ( G2NEventListener listener : mListeners )
		{
			listener.onEvent(args);
		}
		mLock.unlock();
	}

	public void onCreate()
	{
		mLock.lock();
		if ( mCreator != null )
		{
			if ( isCreated == false )
			{
				mCreator.onCreate();
				isCreated = true;
			}
		}
		mLock.unlock();
	}

	public void onDestroy()
	{
		mLock.lock();
		if ( mDestroyer != null )
		{
			if ( isCreated == true )
			{
				mDestroyer.onDestroy();
				isCreated = false;
				mListeners.clear();
			}
		}
		mLock.unlock();
	}

	public void addListener(G2NEventListener listener)
	{
		if ( listener != null )
		{
			mLock.lock();
			if ( mListeners.size() == 0 )
			{
				onCreate();
			}
			listener.setGroup(this);
			listener.setDestroyer(mDestroyer);
			mListeners.add(listener);
			mLock.unlock();
		}
	}

	public void removeListener(String listenerKey)
	{
		if ( listenerKey != null )
		{
			mLock.lock();
			int listenerCount = mListeners.size();
			for ( int i = 0; i < listenerCount; i++ )
			{
				if ( listenerKey.equals(mListeners.get(i).getListenerKey()) )
				{
					mListeners.remove(i);
					break;
				}
			}
			if ( mListeners.size() == 0 )
			{
				onDestroy();
			}
			mLock.unlock();
		}
	}
}
