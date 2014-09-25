package net.gear2net.api.mobile.audio;

import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.audio.exception.G2NAudioAdjustVolumeOptionException;
import net.gear2net.api.mobile.audio.exception.G2NAudioException;
import net.gear2net.api.mobile.audio.exception.G2NAudioModeException;
import net.gear2net.api.mobile.audio.exception.G2NAudioVolumeTypeException;
import net.gear2net.api.mobile.audio.exception.G2NAudioVolumeValueException;
import net.gear2net.framework.event.G2NEventCreator;
import net.gear2net.framework.event.G2NEventDestroyer;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.event.G2NEventListenerGroup;
import net.gear2net.framework.object.G2NObject;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;

public class G2NAudio extends G2NObject
{

	/**
	 * "Enum Value"
	 * 
	 * <audioMode>
	 * AUDIO_STATE_SILENT(0)
	 * AUDIO_STATE_VIBRATE(1)
	 * AUDIO_STATE_NORMAL(2)
	 * 
	 * <volumeType>
	 * VOLUME_TYPE_VOICE_CALL(0)
	 * VOLUME_TYPE_SYSTEM(1)
	 * VOLUME_TYPE_RING(2)
	 * VOLUME_TYPE_MUSIC(3)
	 * VOLUME_TYPE_ALARM(4)
	 * VOLUME_TYPE_NOTIFICATION(5)
	 * VOLUME_TYPE_DTMF(8);
	 * 
	 * <adjustVolumeOption>
	 * ADJUST_VOLUME_OPTION_SHOW_UI(1)
	 * ADJUST_VOLUME_OPTION_PLAY_SOUND(4)
	 */

	static public G2NAudio mInst = null;

	static public G2NAudio getInstance(Context context)
	{

		if ( mInst == null )
		{
			mInst = new G2NAudio(context);
		}
		return mInst;
	}

	private Lock mLock = new ReentrantLock();
	private Context mContext = null;

	private AudioManager mAudioManager = null;
	private G2NEventListenerGroup mAudioModeChangedListeners = null;
	private BroadcastReceiver mAudioModeReceiver = null;
	private G2NEventCreator mEventCreator = null;
	private G2NEventDestroyer mEventDestroyer = null;

	private G2NAudio(Context context)
	{

		this.mLock.lock();

		this.mContext = context;
		this.mAudioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
		
		mAudioModeReceiver = new BroadcastReceiver()
		{
			@Override
			public void onReceive(Context context, Intent intent)
			{

				int audioMode = mAudioManager.getRingerMode();

				Vector<Object> args = new Vector<Object>();
				args.add(audioMode);

				mAudioModeChangedListeners.onEvent(args);
			}
		};
		
		mEventCreator = new G2NEventCreator()
		{
			@Override
			public void onCreate()
			{
				IntentFilter audioModeFilter = new IntentFilter(AudioManager.RINGER_MODE_CHANGED_ACTION);
				mContext.registerReceiver(mAudioModeReceiver, audioModeFilter);
			}
		};

		mEventDestroyer = new G2NEventDestroyer()
		{
			@Override
			public void onDestroy()
			{
				mContext.unregisterReceiver(mAudioModeReceiver);
			}
		};
		
		mAudioModeChangedListeners = new G2NEventListenerGroup(mEventCreator, mEventDestroyer);

		this.mLock.unlock();
	}

	public int getAudioMode()
	{

		return this.mAudioManager.getRingerMode();
	}

	public void setAudioMode(int audioMode)
	{
	
		this.mLock.lock();
		int currentAudioMode = this.mAudioManager.getRingerMode();
		if ( currentAudioMode != audioMode )
		{
			this.mAudioManager.setRingerMode(audioMode);
		}
		this.mLock.unlock();
	}

	public void addAudioModeChangedListener(G2NEventListener listener)
	{
		mAudioModeChangedListeners.addListener(listener);
	}

	public void removeAudioModeChangedListener(String listenerKey)
	{
		mAudioModeChangedListeners.removeListener(listenerKey);
	}

	public int getVolumeValue(int volumeType) throws G2NAudioException
	{

		try
		{
			mLock.lock();
			int currentAudioMode = this.mAudioManager.getRingerMode();

			if ( !isRingerModeNormal(currentAudioMode) )
				throw new G2NAudioModeException(currentAudioMode);

			if ( !isVolumeType(volumeType) )
				throw new G2NAudioVolumeTypeException();
		}

		catch (G2NAudioException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}

		return this.mAudioManager.getStreamVolume(volumeType);
	}

	public void setVolumeValue(int volumeType, int volumeValue, int adjustVolumeOption) throws G2NAudioException
	{

		try
		{
			mLock.lock();
			int currentAudioMode = this.mAudioManager.getRingerMode();

			if ( !isRingerModeNormal(currentAudioMode) )
				throw new G2NAudioModeException(currentAudioMode);

			if ( !isVolumeType(volumeType) )
				throw new G2NAudioVolumeTypeException();

			if ( !checkVolumeValue(volumeType, volumeValue) )
				throw new G2NAudioVolumeValueException();

			if ( !isAdjustVolumeOption(adjustVolumeOption) )
				throw new G2NAudioAdjustVolumeOptionException();

			mAudioManager.setStreamVolume(volumeType, volumeValue, adjustVolumeOption);
		}

		catch (G2NAudioException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	public int getMaxVolumeValue(int volumeType) throws G2NAudioException
	{

		try
		{
			mLock.lock();
			int currentAudioMode = this.mAudioManager.getRingerMode();

			if ( !isRingerModeNormal(currentAudioMode) )
				throw new G2NAudioModeException(currentAudioMode);

			if ( !isVolumeType(volumeType) )
				throw new G2NAudioVolumeTypeException();
		}

		catch (G2NAudioException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}

		return mAudioManager.getStreamMaxVolume(volumeType);
	}

	public void adjustVolumeUp(int volumeType, int adjustVolumeOption) throws G2NAudioException
	{

		try
		{
			mLock.lock();
			int currentAudioMode = this.mAudioManager.getRingerMode();

			if ( !isRingerModeNormal(currentAudioMode) )
				throw new G2NAudioModeException(currentAudioMode);

			if ( !isVolumeType(volumeType) )
				throw new G2NAudioVolumeTypeException();

			if ( !isAdjustVolumeOption(adjustVolumeOption) )
				throw new G2NAudioAdjustVolumeOptionException();

			mAudioManager.adjustStreamVolume(volumeType, AudioManager.ADJUST_RAISE, adjustVolumeOption);
		}

		catch (G2NAudioException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	public void adjustVolumeDown(int volumeType, int adjustVolumeOption) throws G2NAudioException
	{

		try
		{
			mLock.lock();
			int currentAudioMode = this.mAudioManager.getRingerMode();

			if ( !isRingerModeNormal(currentAudioMode) )
				throw new G2NAudioModeException(currentAudioMode);

			if ( !isVolumeType(volumeType) )
				throw new G2NAudioVolumeTypeException();

			if ( !isAdjustVolumeOption(adjustVolumeOption) )
				throw new G2NAudioAdjustVolumeOptionException();

			mAudioManager.adjustStreamVolume(volumeType, AudioManager.ADJUST_LOWER, adjustVolumeOption);
		}

		catch (G2NAudioException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	private boolean isRingerModeNormal(int audioMode)
	{

		switch ( audioMode )
		{
			case AudioManager.RINGER_MODE_NORMAL:
				return true;
		}
		return false;
	}

	private boolean isVolumeType(int volumeType)
	{

		switch ( volumeType )
		{
			case AudioManager.STREAM_VOICE_CALL:
			case AudioManager.STREAM_SYSTEM:
			case AudioManager.STREAM_RING:
			case AudioManager.STREAM_MUSIC:
			case AudioManager.STREAM_ALARM:
			case AudioManager.STREAM_NOTIFICATION:
			case AudioManager.STREAM_DTMF:
				return true;
		}
		return false;
	}

	private boolean checkVolumeValue(int volumeType, int volumeValue)
	{

		if ( (volumeValue >= 0) && (volumeValue <= this.mAudioManager.getStreamMaxVolume(volumeType)) )
		{
			return true;
		}
		return false;
	}

	private boolean isAdjustVolumeOption(int adjustVolumeOption)
	{

		switch ( adjustVolumeOption )
		{
			case AudioManager.FLAG_SHOW_UI:
			case AudioManager.FLAG_PLAY_SOUND:
				return true;
		}
		return false;
	}

}
