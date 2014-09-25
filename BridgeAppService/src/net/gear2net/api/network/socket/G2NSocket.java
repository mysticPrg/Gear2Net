package net.gear2net.api.network.socket;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.network.socket.runnable.TCPReadRunnable;
import net.gear2net.api.network.socket.runnable.UDPReadRunnable;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.event.G2NEventListenerGroup;
import net.gear2net.framework.object.G2NObject;

public class G2NSocket extends G2NObject
{
	/**
	 * "Enum Value"
	 * 
	 * <ProtocolType>
	 * TCP(0)
	 * UDP(1)
	 */
	static private final int PROTOCOL_TCP = 0;
	static private final int PROTOCOL_UDP = 1;

	final private Lock mLock = new ReentrantLock();

	private InnerSocket mInnerSocket = null;
	private G2NAddress mSocketAddress = null;

	private G2NEventListenerGroup mOnReceiveMessageListeners = null;
	private G2NEventListenerGroup mOnConnectedListeners = null;
	private G2NEventListenerGroup mOnDisconnectedListener = null;
	
	public G2NSocket(G2NAddress address, int protocol)
	{

		mLock.lock();

		mOnReceiveMessageListeners = new G2NEventListenerGroup(G2NEventListenerGroup.EmptyCreator, G2NEventListenerGroup.EmptyDestroyer);
		mOnConnectedListeners = new G2NEventListenerGroup(G2NEventListenerGroup.EmptyCreator, G2NEventListenerGroup.EmptyDestroyer);
		mOnDisconnectedListener = new G2NEventListenerGroup(G2NEventListenerGroup.EmptyCreator, G2NEventListenerGroup.EmptyDestroyer);

		this.mSocketAddress = address;

		if ( protocol == PROTOCOL_TCP )
		{
			mInnerSocket = new InnerTCPSocket();
		}

		else if ( protocol == PROTOCOL_UDP )
		{
			mInnerSocket = new InnerUDPSocket();
		}

		mLock.unlock();
	}

	public void openAndListen() throws UnknownHostException, IOException, InterruptedException
	{
		mLock.lock();
		mInnerSocket.openAndListen();
		mLock.unlock();
	}

	public G2NAddress getAddress()
	{
		return this.mSocketAddress;
	}

	public void sendMessage(String message) throws IOException
	{
		mLock.lock();
		mInnerSocket.sendMessage(message);
		mLock.unlock();
	}

	public void addReceiveMessageListener(G2NEventListener listener)
	{
		mOnReceiveMessageListeners.addListener(listener);
	}
	
	public void removeReceiveMessageListener(String listenerKey)
	{
		mOnReceiveMessageListeners.removeListener(listenerKey);
	}
	
	public void addConnectedListener(G2NEventListener listener)
	{
		mOnConnectedListeners.addListener(listener);
	}
	
	public void removeConnectedListener(String listenerKey)
	{
		mOnConnectedListeners.removeListener(listenerKey);
	}
	
	public void addDisconnectedListener(G2NEventListener listener)
	{
		mOnDisconnectedListener.addListener(listener);
	}
	
	public void removeDisconnectedListener(String listenerKey)
	{
		mOnDisconnectedListener.removeListener(listenerKey);
	}

	public void close()
	{
		mLock.lock();
		mInnerSocket.close();
		mLock.unlock();
	}

	private interface InnerSocket
	{
		public void openAndListen() throws UnknownHostException, IOException, InterruptedException;

		public G2NAddress getAddress();

		public void sendMessage(String message) throws UnknownHostException, IOException;
		
		public void close();
	}

	// connect & send error exception
	private class InnerTCPSocket implements InnerSocket
	{

		private Socket tcpSocket = null;
		private PrintWriter out = null;
		private TCPReadRunnable mRunnable = null;
		
		public void openAndListen() throws UnknownHostException, IOException, InterruptedException
		{
			tcpSocket = new Socket(mSocketAddress.getIP(), mSocketAddress.getPort());
			out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(tcpSocket.getOutputStream())), true);
			mOnConnectedListeners.onEvent(null);
			
			mRunnable = new TCPReadRunnable(tcpSocket, mOnReceiveMessageListeners, mOnDisconnectedListener);
			new Thread(mRunnable).start();
		}

		@Override
		public G2NAddress getAddress()
		{
			InetAddress inetAddress = tcpSocket.getInetAddress();
			return new G2NAddress(inetAddress.getHostName(), tcpSocket.getPort());
		}

		@Override
		public void sendMessage(String message)
		{
			out.println(message);
		}

		@Override
		public void close()
		{
			try
			{
				mRunnable.mRun = false;
				out.close();
				if ( !tcpSocket.isClosed() )
				{
					tcpSocket.close();
					mOnDisconnectedListener.onEvent(null);
				}

			} catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}

	private class InnerUDPSocket implements InnerSocket
	{

		private DatagramSocket udpSocket = null;
		DatagramPacket out = null;
		DatagramPacket in = null;
		private UDPReadRunnable mRunnable = null;
		private InetAddress mInetAddress = null;
		
		@Override
		public void openAndListen() throws UnknownHostException, SocketException
		{
			mInetAddress = InetAddress.getByName(mSocketAddress.getIP());
			
			udpSocket = new DatagramSocket();
			InetSocketAddress isa = new InetSocketAddress(mSocketAddress.getPort());
//			udpSocket.bind(isa);
			
			udpSocket.connect(mInetAddress, mSocketAddress.getPort());
			
			mOnConnectedListeners.onEvent(null);
			
			mRunnable = new UDPReadRunnable(udpSocket, mOnReceiveMessageListeners, mOnDisconnectedListener);
			new Thread(mRunnable).start();
		}

		@Override
		public G2NAddress getAddress()
		{
			InetAddress address = in.getAddress();
			return new G2NAddress(address.toString(), in.getPort());
		}

		@Override
		public void sendMessage(String message) throws IOException
		{
			
			out = new DatagramPacket(message.getBytes(), message.length(), mInetAddress, mSocketAddress.getPort());
			udpSocket.send(out);
		}


		@Override
		public void close()
		{
			mRunnable.mRun = false;
			if ( !udpSocket.isClosed() )
			{
				udpSocket.close();
				mOnDisconnectedListener.onEvent(null);
			}
		}
	}
}