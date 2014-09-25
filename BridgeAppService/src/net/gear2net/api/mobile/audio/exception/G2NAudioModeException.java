package net.gear2net.api.mobile.audio.exception;

@SuppressWarnings("serial")
public class G2NAudioModeException extends G2NAudioException
{

	private int mAudioMode = -1;

	public G2NAudioModeException(int audioMode)
	{
		this.mAudioMode = audioMode;
	}

	@Override
	public String getMessage()
	{

		switch ( this.mAudioMode )
		{

			case -1:
				return "G2NAudioModeException. The audio mode is not setting. Input the setting that matches audio mode.";

			case 0:
				return "G2NAudioModeException. Currently setted audio mode is silent mode. This function need to change normal of audio mode.";

			case 1:
				return "G2NAudioModeException. Currently setted audio mode is vibrate mode. This function need to change normal of audio mode.";

			default:
				return "G2NAudioModeException. Currently setted audio mode is unknown.";
		}
	}
}
