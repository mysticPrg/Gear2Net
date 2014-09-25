package net.gear2net.api.mobile.sensor.exception;

@SuppressWarnings("serial")
public class G2NWrongSensorTypeException extends G2NSensorException
{

	@Override
	public String getMessage()
	{
		return "G2NWrongSensorTypeException. Currently setted sensor type is unknown.";
	}
}
