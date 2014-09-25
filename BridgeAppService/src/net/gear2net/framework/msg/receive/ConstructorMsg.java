package net.gear2net.framework.msg.receive;

import org.json.JSONException;

public class ConstructorMsg extends AgingMsg
{

	public ConstructorMsg(String msg) throws JSONException
	{
		super(msg);
	}

	public String getClassname() throws JSONException
	{
		return mJson.getString("classname");
	}
}
