package net.gear2net.api.mobile.sensor.exception;

@SuppressWarnings("serial")
public class G2NSensorEventListenerException extends G2NSensorException
{

	@Override
	public String getMessage()
	{
		return "G2NSensorEventListenerException. Changes to value of sensor is not registered to listener.";
	}
}
