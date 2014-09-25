package net.gear2net.framework.event;

import java.io.IOException;
import java.util.Vector;

import net.gear2net.framework.G2NWidget;
import net.gear2net.framework.msg.send.OnEventListenerMsg;

import org.json.JSONException;

import com.samsung.android.sdk.accessory.SASocket;

public class G2NEventListener
{
	private String mListenerKey = null;
	private SASocket mSocket = null;
	private G2NWidget mWidget = null;
	private G2NEventListenerGroup mGroup = null;

	private G2NEventDestroyer mEventDestroyer = null;

	public G2NEventListener(String listenerKey, SASocket socket, G2NWidget widget)
	{
		mListenerKey = listenerKey;
		mSocket = socket;
		mWidget = widget;
	}

	public void onEvent(Vector<Object> args)
	{
		if ( mWidget.isPause() == false )
		{
			try
			{
				OnEventListenerMsg msg = new OnEventListenerMsg();
				msg.setArgs(args);
				msg.setListenerKey(mListenerKey);
				msg.setSocket(mSocket);
				msg.setWidget(mWidget);
				msg.send();
			} catch (JSONException e)
			{
				// TODO: 예외 전달
				e.printStackTrace();
			} catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}

	public void onDestroy()
	{
		if ( mEventDestroyer != null )
			mEventDestroyer.onDestroy();
	}

	public void setDestroyer(G2NEventDestroyer eventDestroyer)
	{
		mEventDestroyer = eventDestroyer;
	}

	public void setGroup(G2NEventListenerGroup group)
	{
		mGroup = group;
	}

	public G2NEventListenerGroup getGroup()
	{
		return mGroup;
	}

	public String getListenerKey()
	{
		return mListenerKey;
	}

	public G2NWidget getWidget()
	{
		return mWidget;
	}
}
