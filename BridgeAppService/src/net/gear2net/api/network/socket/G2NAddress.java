package net.gear2net.api.network.socket;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.object.G2NObject;

public class G2NAddress extends G2NObject
{
	final private Lock mLock = new ReentrantLock();

	private String mIP = null;
	private int mPort = -1;

	public G2NAddress()
	{

	}

	public G2NAddress(String ip, int port)
	{
		mLock.lock();
		this.mIP = ip;
		this.mPort = port;
		mLock.unlock();
	}

	public void setIP(String ip)
	{
		mLock.lock();
		this.mIP = ip;
		mLock.unlock();
	}

	public String getIP()
	{
		return this.mIP;
	}

	public void setPort(int port)
	{
		mLock.lock();
		this.mPort = port;
		mLock.unlock();
	}

	public int getPort()
	{
		return this.mPort;
	}
}
