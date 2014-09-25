package net.gear2net.api.mobile.vibrate.exception;

@SuppressWarnings("serial")
public class G2NVibrateTimerException extends G2NVibrateException
{
	@Override
	public String getMessage()
	{
		return "G2NVibrateTimeException. Currently set time is negative number.";
	}
}
