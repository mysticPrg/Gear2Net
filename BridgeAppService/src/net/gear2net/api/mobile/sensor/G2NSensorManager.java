package net.gear2net.api.mobile.sensor;


import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.sensor.exception.G2NSensorException;
import net.gear2net.api.mobile.sensor.exception.G2NWrongSensorTypeException;
import net.gear2net.framework.object.G2NObject;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorManager;

public class G2NSensorManager extends G2NObject {
	
	/** 
	 * "Enum Value" 
	 * 
	 * <sensorType>
	 * ACCELROMETER(1)
	 * GYROSCOPE(4)
	 * LIGHT(5)
	 */

	static public G2NSensorManager mInst = null;

	static public G2NSensorManager getInstance(Context context)
	{

		if ( mInst == null )
		{
			mInst = new G2NSensorManager(context);
		}
		return mInst;
	}

	private Lock mLock = new ReentrantLock();

	private SensorManager mSensorManager = null;
	private Context mContext = null;

	private G2NSensorManager(Context context)
	{
		mLock.lock();
		this.mContext = context;
		mSensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
		mLock.unlock();
	}

	SensorManager getSensorManager()
	{

		return mSensorManager;
	}

	private boolean checkSensorType(int type)
	{

		switch ( type )
		{

			case Sensor.TYPE_ACCELEROMETER:
			case Sensor.TYPE_LIGHT:
			case Sensor.TYPE_GYROSCOPE:
				return true;

			default:
				return false;
		}
	}

	public G2NSensor getSensor(int type) throws G2NSensorException
	{

		mLock.lock();
		G2NSensor obj = null;

		try
		{
			if ( !checkSensorType(type) )
				throw new G2NWrongSensorTypeException();

			Sensor sensor = null;

			switch ( type )
			{

				case Sensor.TYPE_ACCELEROMETER:
					sensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
					break;

				case Sensor.TYPE_LIGHT:
					sensor = mSensorManager.getDefaultSensor(Sensor.TYPE_LIGHT);
					break;

				case Sensor.TYPE_GYROSCOPE:
					sensor = mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
					break;
			}
			obj = new G2NSensor(mContext, sensor);
		}

		catch (G2NSensorException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}

		return obj;
	}

}