package net.gear2net.api.mobile.wifi.exception;

@SuppressWarnings("serial")
public class G2NWifiDisabledException extends G2NWifiException
{

	@Override
	public String getMessage()
	{
		return "G2NWifiDisabledException. Wifi was turned off.";
	}
}
