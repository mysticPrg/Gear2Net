package net.gear2net.api.mobile.audio.exception;

@SuppressWarnings("serial")
public class G2NAudioAdjustVolumeOptionException extends G2NAudioException
{

	@Override
	public String getMessage()
	{
		return "G2NAudioAdjustVolumeOptionException. Currently setted option of adjust volume is unknown.";
	}
}