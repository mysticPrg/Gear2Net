package net.gear2net.api.mobile.sensor.exception;

@SuppressWarnings("serial")
public class G2NSensorAlreadyStartListenning extends G2NSensorException
{
	@Override
	public String getMessage()
	{
		return "G2NSensorAlreadyStartListenningException. "
				+ "you are not call the addSensorChangedListener method.";
	}
}
