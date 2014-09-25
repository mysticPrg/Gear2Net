package net.gear2net.api.mobile.audio.exception;

@SuppressWarnings("serial")
public class G2NAudioVolumeValueException extends G2NAudioException
{

	@Override
	public String getMessage()
	{
		return "G2NAudioVolumeValueException. Currently setted integer of volume value is negative number or it exceeds the max volume for volume type.";
	}
}
