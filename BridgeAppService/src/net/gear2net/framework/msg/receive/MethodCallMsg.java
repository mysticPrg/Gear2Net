package net.gear2net.framework.msg.receive;

import org.json.JSONException;

public class MethodCallMsg extends AgingMsg
{

	public MethodCallMsg(String msg) throws JSONException
	{
		super(msg);
	}

	public String getFunc() throws JSONException
	{
		return mJson.getString("func");
	}
}
