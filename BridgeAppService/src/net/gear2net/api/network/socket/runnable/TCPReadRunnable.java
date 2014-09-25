package net.gear2net.api.network.socket.runnable;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.Vector;

import net.gear2net.framework.event.G2NEventListenerGroup;

public class TCPReadRunnable implements Runnable
{
	public boolean mRun = true;
	private Socket mSocket = null;
	private BufferedReader in = null;

	private G2NEventListenerGroup mOnReceiveMessageListeners = null;
	private G2NEventListenerGroup mOnDisconnectedListeners = null;

	public TCPReadRunnable(Socket socket, G2NEventListenerGroup onReceiveMessageListeners, G2NEventListenerGroup onDisconnectedListeners)
	{
		mSocket = socket;
		mOnReceiveMessageListeners = onReceiveMessageListeners;
		mOnDisconnectedListeners = onDisconnectedListeners;
	}

	@Override
	public void run()
	{
		try
		{
			in = new BufferedReader(new InputStreamReader(mSocket.getInputStream(), "UTF-8"));
			Vector<Object> args;
			while (mRun)
			{
				if ( mSocket.isClosed() )
					break;

				String inStr = null;
				inStr = in.readLine();
				if ( inStr == null )
					break;

				args = new Vector<Object>();
				args.add(new String(inStr)); // copy
				mOnReceiveMessageListeners.onEvent(args);
			}
		} catch (Exception e)
		{
			e.printStackTrace();
		} finally
		{
			try
			{
				in.close();
				if ( !mSocket.isClosed() )
					mSocket.close();
			} catch (IOException e)
			{
				e.printStackTrace();
			} finally
			{
				mOnDisconnectedListeners.onEvent(null);
			}
		}
	}
}
