package net.gear2net.framework.service;

import net.gear2net.framework.DebugLog;
import net.gear2net.framework.msg.G2NMsg;
import net.gear2net.framework.msg.receive.ReceiveMsg;
import net.gear2net.framework.msgqueue.G2NSystemQueue;

import org.json.JSONException;
import org.json.JSONObject;

import com.samsung.android.sdk.accessory.SASocket;

public class WatchWidgetSASocket extends SASocket
{
	private G2NSystemQueue mSystemQueue = null;

	public WatchWidgetSASocket()
	{
		super(WatchWidgetSASocket.class.getName());
	}

	@Override
	public void onError(int channelId, String errorString, int error)
	{
		DebugLog.log("Connection is not alive ERROR: " + errorString + "  " + error);
	}

	@Override
	public void onReceive(int channelId, byte[] data)
	{
		String msg = new String(data); // ¸Þ½ÃÁö
		try
		{
			G2NMsg msgObj = G2NMsg.createMsg(msg);
			msgObj.setSocket(this);
			mSystemQueue.put((ReceiveMsg) msgObj);
		} catch (InterruptedException e)
		{
			e.printStackTrace();
		} catch (JSONException e)
		{
			e.printStackTrace();
		}
	}

	@Override
	protected void onServiceConnectionLost(int errorCode)
	{
		DebugLog.log("onServiceConectionLost: error code =" + errorCode);

		try
		{
			JSONObject jsonMsg = new JSONObject();
			jsonMsg.put("status", "destroy");
			jsonMsg.put("countOfThread", 0);
			jsonMsg.put("callbackKey", "null");

			mSystemQueue.put((ReceiveMsg) G2NMsg.createMsg(jsonMsg.toString()));
		} catch (InterruptedException e)
		{
			e.printStackTrace();
		} catch (JSONException e)
		{
			e.printStackTrace();
		}

	}

	public void setSystemQueue(G2NSystemQueue systemQueue)
	{
		mSystemQueue = systemQueue;
	}

}
