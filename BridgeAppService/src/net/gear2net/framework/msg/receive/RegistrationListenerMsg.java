package net.gear2net.framework.msg.receive;

import org.json.JSONException;

public class RegistrationListenerMsg extends AgingMsg
{

	public RegistrationListenerMsg(String msg) throws JSONException
	{
		super(msg);
	}

	public String getFunc() throws JSONException
	{
		return mJson.getString("func");
	}

	public String getListenerKey() throws JSONException
	{
		return mJson.getString("listenerKey");
	}
}
