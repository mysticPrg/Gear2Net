package net.gear2net.api.mobile.wifi.exception;

@SuppressWarnings("serial")
public class G2NWifiListNullException extends G2NWifiException
{

	@Override
	public String getMessage()
	{
		return "G2NWifiListNullException. Wifi list does not exist.";
	}
}
