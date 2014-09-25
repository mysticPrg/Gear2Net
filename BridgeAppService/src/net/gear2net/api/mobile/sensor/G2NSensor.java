package net.gear2net.api.mobile.sensor;

import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.sensor.exception.G2NSensorAlreadyStartListenning;
import net.gear2net.api.mobile.sensor.exception.G2NSensorAlreadyStopListenning;
import net.gear2net.api.mobile.sensor.exception.G2NSensorEventListenerException;
import net.gear2net.api.mobile.sensor.exception.G2NSensorException;
import net.gear2net.api.mobile.sensor.exception.G2NWrongSensorDelayOptionException;
import net.gear2net.framework.event.G2NEventDestroyer;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.object.G2NObject;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;

public class G2NSensor extends G2NObject {

	/** 
	 * "Enum Value"
	 * 
	 * <delayOption> 
	 * FAST(1)
	 * NORMAL(3)
	 */
	private final int DELAY_FAST = 1;
	private final int DELAY_NORMAL = 3;

	private Lock mLock = null;

	private Sensor mSensor = null;
	private Context mContext = null;
	private G2NSensorManager mSensorManager = null;
	private Vector<G2NEventListener> mSensorChangedListeners = null;
	private boolean isListenning = false;
	private G2NEventDestroyer mEventDestroyer = null;

	private SensorEventListener mListener = new SensorEventListener()
	{

		@Override
		public void onSensorChanged(SensorEvent event)
		{

			mLock.lock();

			Vector<Object> args = new Vector<Object>();

			switch ( event.sensor.getType() )
			{

				case Sensor.TYPE_ACCELEROMETER:
					args.add(event.values[0]);
					args.add(event.values[1]);
					args.add(event.values[2]);
					break;

				case Sensor.TYPE_LIGHT:
					args.add(event.values[0]);
					break;

				case Sensor.TYPE_GYROSCOPE:
					args.add(event.values[0]);
					args.add(event.values[1]);
					args.add(event.values[2]);
					break;
			}

			// TODO: ¿¹¿Ü throw

			for ( G2NEventListener listener : mSensorChangedListeners )
			{
				listener.onEvent(args);
			}

			mLock.unlock();
		}

		@Override
		public void onAccuracyChanged(Sensor sensor, int accuracy)
		{

		}
	};

	G2NSensor(Context context, Sensor sensor)
	{

		setIsNew();

		mLock = new ReentrantLock();
		mLock.lock();
		this.mContext = context;
		mSensor = sensor;
		mSensorManager = G2NSensorManager.getInstance(mContext);
		mSensorChangedListeners = new Vector<G2NEventListener>();

		mEventDestroyer = new G2NEventDestroyer()
		{
			@Override
			public void onDestroy()
			{
				mSensorManager.getSensorManager().unregisterListener(mListener);
			}
		};
		mLock.unlock();
	}

	public void addSensorChangedListener(G2NEventListener listener)
	{

		if ( listener != null )
		{
			mLock.lock();
			listener.setDestroyer(mEventDestroyer);
			mSensorChangedListeners.add(listener);
			mLock.unlock();
		}
	}

	public void removeSensorChangedListener(String listenerKey) throws G2NSensorException
	{

		mLock.lock();

		if ( listenerKey != null )
		{
			for ( G2NEventListener listener : mSensorChangedListeners )
			{
				if ( listenerKey.equals(listener.getListenerKey()) )
				{
					mSensorChangedListeners.remove(listener);
				}
			}
		}

		mLock.unlock();
	}

	private boolean checkSensorDelayOption(int delayOption)
	{

		switch ( delayOption )
		{

			case DELAY_FAST:
			case DELAY_NORMAL:
				return true;

			default:
				return false;
		}
	}

	public void startListen(int delayOption) throws G2NSensorException
	{

		try
		{
			mLock.lock();

			if ( isListenning == true )
				throw new G2NSensorAlreadyStartListenning();

			if ( mSensorChangedListeners.size() == 0 )
				throw new G2NSensorEventListenerException();

			if ( !checkSensorDelayOption(delayOption) )
				throw new G2NWrongSensorDelayOptionException();

			isListenning = true;
			mSensorManager.getSensorManager().registerListener(mListener, mSensor, delayOption);
		}

		catch (G2NSensorException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	public void stopListen() throws G2NSensorException
	{

		try
		{
			mLock.lock();

			if ( isListenning == false )
				throw new G2NSensorAlreadyStopListenning();

			isListenning = false;
			mEventDestroyer.onDestroy();
		}

		catch (G2NSensorException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}
	}

	public float getMaximumRange()
	{

		return mSensor.getMaximumRange();
	}

	public String getName()
	{

		return mSensor.getName();
	}

	public float getPower()
	{

		return mSensor.getPower();
	}

	public float getResolution()
	{

		return mSensor.getResolution();
	}

	public String getType()
	{

		mLock.lock();

		String type = null;
		int sensorNumber = mSensor.getType();

		switch ( sensorNumber )
		{

			case 1:
				type = "ACCELEROMETER";
				break;

			case 4:
				type = "GYROSCOPE";
				break;

			case 5:
				type = "LIGHT";
				break;
		}

		mLock.unlock();
		return type;
	}

	public String getVendor()
	{

		return mSensor.getVendor();
	}

	public int getVersion()
	{

		return mSensor.getVersion();
	}

	public String getDescript()
	{

		return mSensor.toString();
	}

}
