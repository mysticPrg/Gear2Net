package net.gear2net.framework.msg.send;

import java.io.IOException;

import net.gear2net.framework.G2NWidget.WidgetType;
import net.gear2net.framework.msg.G2NMsg;

import org.json.JSONException;
import org.json.JSONObject;

public abstract class SendMsg extends G2NMsg
{
	private static final int CHANNEL_ID_NORMAL = 810;
	private static final int CHANNEL_ID_WATCH = 811;

	public SendMsg(MsgType type) throws JSONException
	{
		mJson = new JSONObject();
		mJson.put("msgType", type.toString());
		mType = type;
	}

	public synchronized void send() throws IOException, JSONException
	{
		if ( mSocket != null )
		{
			int channel = CHANNEL_ID_NORMAL;
			switch ( mWidget.getType() )
			{
				case NORMAL:
					channel = CHANNEL_ID_NORMAL;
					break;
				case WATCH:
					channel = CHANNEL_ID_WATCH;
					break;
			}
			mSocket.send(channel, this.toString().getBytes());
		}
	}

	public synchronized void send(WidgetType widgetType) throws IOException
	{
		if ( mSocket != null )
		{
			int channel = CHANNEL_ID_NORMAL;
			switch ( widgetType )
			{
				case NORMAL:
					channel = CHANNEL_ID_NORMAL;
					break;
				case WATCH:
					channel = CHANNEL_ID_WATCH;
					break;
			}
			mSocket.send(channel, this.toString().getBytes());
		}
	}
}
