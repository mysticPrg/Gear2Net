package net.gear2net.api.mobile.audio.exception;

@SuppressWarnings("serial")
public class G2NAudioVolumeTypeException extends G2NAudioException
{

	@Override
	public String getMessage()
	{
		return "G2NAudioVolumeTypeException. Currently setted volume type is unknown.";
	}
}
