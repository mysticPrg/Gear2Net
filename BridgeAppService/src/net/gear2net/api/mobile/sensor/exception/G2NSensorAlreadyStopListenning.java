package net.gear2net.api.mobile.sensor.exception;

@SuppressWarnings("serial")
public class G2NSensorAlreadyStopListenning extends G2NSensorException
{
	@Override
	public String getMessage()
	{
		return "G2NSensorAlreadyStopListenningException. "
				+ "you are not call the removeSensorChangedListener method.";
	}
}
