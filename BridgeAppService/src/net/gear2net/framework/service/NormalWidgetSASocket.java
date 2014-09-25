package net.gear2net.framework.service;

import net.gear2net.framework.DebugLog;
import net.gear2net.framework.msg.G2NMsg;
import net.gear2net.framework.msg.receive.ReceiveMsg;
import net.gear2net.framework.msgqueue.G2NSystemQueue;

import org.json.JSONException;

import com.samsung.android.sdk.accessory.SASocket;

public class NormalWidgetSASocket extends SASocket
{
	private G2NSystemQueue mSystemQueue = null;

	public NormalWidgetSASocket()
	{
		super(NormalWidgetSASocket.class.getName());
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
			DebugLog.log("Normal Msg receive: " + msg);
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
	}

	public void setSystemQueue(G2NSystemQueue systemQueue)
	{
		mSystemQueue = systemQueue;
		mSystemQueue.setSocket(this);
	}

}
