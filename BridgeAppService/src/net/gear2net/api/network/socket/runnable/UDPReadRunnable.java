package net.gear2net.api.network.socket.runnable;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.util.Vector;

import net.gear2net.framework.event.G2NEventListenerGroup;

public class UDPReadRunnable implements Runnable
{
	public boolean mRun = true;
	private DatagramSocket mSocket = null;
	DatagramPacket in = null;

	private G2NEventListenerGroup mOnReceiveMessageListeners = null;
	private G2NEventListenerGroup mOnDisconnectedListeners = null;

	public UDPReadRunnable(DatagramSocket socket, G2NEventListenerGroup onReceiveMessageListeners, G2NEventListenerGroup onDisconnectedListeners)
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
			byte[] temp = new byte[65508];
			in = new DatagramPacket(temp, temp.length);
			Vector<Object> args;

			while (mRun)
			{
				// if ( mSocket.isClosed() )
				// {
				// break;
				// }

				mSocket.receive(in);
				args = new Vector<Object>();
				String data = new String(in.getData(), 0, in.getLength());

				args.add(data);
				mOnReceiveMessageListeners.onEvent(args);
			}
		} catch (IOException e)
		{
			mOnDisconnectedListeners.onEvent(null);
		} finally
		{
			if ( !mSocket.isClosed() )
				mSocket.close();

			mOnDisconnectedListeners.onEvent(null);
		}

	}

}
