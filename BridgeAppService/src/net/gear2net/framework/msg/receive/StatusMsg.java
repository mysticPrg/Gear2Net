package net.gear2net.framework.msg.receive;

import org.json.JSONException;

public class StatusMsg extends ReceiveMsg
{
	public StatusMsg(String msg) throws JSONException
	{
		super(msg);
	}

	public String getStatus() throws JSONException
	{
		return mJson.getString("status");
	}

	public int getCountOfThread() throws JSONException
	{
		return Integer.parseInt(mJson.getString("countOfThread"));
	}
}
