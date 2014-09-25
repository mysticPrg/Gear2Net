package net.gear2net.api.util.log;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.object.G2NObject;
import android.content.Context;
import android.util.Log;

public class G2NLog extends G2NObject
{

	/**
	 * "Enum Value" = null
	 */

	final private Lock mLock = new ReentrantLock();

	static public G2NLog mInst = null;

	static public G2NLog getInstance(Context context)
	{
		if ( mInst == null )
		{
			mInst = new G2NLog(context);
		}
		return mInst;
	}

	private G2NLog(Context context)
	{

	}

	public void info(String tag, String msg)
	{
		mLock.lock();
		Log.i(tag, msg);
		mLock.unlock();
	}

	public void debug(String tag, String msg)
	{
		mLock.lock();
		Log.d(tag, msg);
		mLock.unlock();
	}

	public void warning(String tag, String msg)
	{
		mLock.lock();
		Log.w(tag, msg);
		mLock.unlock();
	}

	public void error(String tag, String msg)
	{
		mLock.lock();
		Log.e(tag, msg);
		mLock.unlock();
	}
}
