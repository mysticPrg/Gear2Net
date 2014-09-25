package net.gear2net.api.mobile.vibrate;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.vibrate.exception.G2NVibrateException;
import net.gear2net.api.mobile.vibrate.exception.G2NVibrateTimerException;
import net.gear2net.framework.object.G2NObject;
import android.content.Context;
import android.os.Vibrator;

public class G2NVibrate extends G2NObject
{

	/**
	 * "Enum Value" = null
	 */

	static public G2NVibrate mInst = null;

	static public G2NVibrate getInstance(Context context)
	{

		if ( mInst == null )
		{
			mInst = new G2NVibrate(context);
		}
		return mInst;
	}

	private Lock mLock = new ReentrantLock();

	private Vibrator mVibrateManager = null;

	public G2NVibrate(Context context)
	{

		mLock.lock();
		mVibrateManager = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
		mLock.unlock();
	}

	public void playVibrate(long playTime) throws G2NVibrateException
	{

		try
		{
			mLock.lock();

			if ( !checkPositiveTime(playTime) )
				throw new G2NVibrateTimerException();

			mVibrateManager.vibrate(playTime);
		}

		catch (G2NVibrateException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	public void playPatternVibrate(long waitTime, long playTime) throws G2NVibrateException
	{

		try
		{
			mLock.lock();

			if ( !checkPositiveTime(waitTime) )
				throw new G2NVibrateTimerException();

			if ( !checkPositiveTime(playTime) )
				throw new G2NVibrateTimerException();

			long pattern[] = { waitTime, playTime };
			mVibrateManager.vibrate(pattern, 0);
		}

		catch (G2NVibrateException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	public void stopVibrate()
	{

		mLock.lock();
		mVibrateManager.cancel();
		mLock.unlock();
	}

	private boolean checkPositiveTime(long time)
	{

		if ( time >= 0 )
			return true;
		else
			return false;
	}

}
