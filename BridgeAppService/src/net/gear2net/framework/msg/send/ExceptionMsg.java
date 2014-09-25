package net.gear2net.framework.msg.send;

import org.json.JSONException;

public class ExceptionMsg extends SendMsg
{

	public ExceptionMsg() throws JSONException
	{
		super(MsgType.EXCEPTION);
	}

	public void setException(Exception e) throws JSONException
	{
		mJson.put("exception", e.getClass().getName());
		mJson.put("msg", e.getMessage());
	}
}
