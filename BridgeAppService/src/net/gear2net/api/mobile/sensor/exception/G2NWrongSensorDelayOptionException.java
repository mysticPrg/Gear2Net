package net.gear2net.api.mobile.sensor.exception;

@SuppressWarnings("serial")
public class G2NWrongSensorDelayOptionException extends G2NSensorException
{
	@Override
	public String getMessage()
	{
		return "G2NWrongSensorDelayOptionException. Currently setted delay option for sensor is unknown.";
	}

}
