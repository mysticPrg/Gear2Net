package net.gear2net.api.mobile.wifi;

import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.object.G2NObject;

public class G2NWifiInfo extends G2NObject
{

	/**
	 * "Enum Value" = null;
	 */

	private ReentrantLock mLock = new ReentrantLock();
	private String mSSID;
	private String mBSSID;
	private int mLevel;

	G2NWifiInfo(String SSID, String BSSID, int level)
	{
		mLock.lock();
		setIsNew();
		this.mSSID = SSID;
		this.mBSSID = BSSID;
		this.mLevel = level;
		mLock.unlock();
	}

	public String getSSID()
	{
		return mSSID;
	}

	public int getLevel()
	{
		return mLevel;
	}

	public String getBSSID()
	{
		return mBSSID;
	}

}
