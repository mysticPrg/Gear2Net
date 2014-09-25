package net.gear2net.api.mobile.wifi;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.wifi.exception.G2NWifiException;
import net.gear2net.api.mobile.wifi.exception.G2NWifiListNullException;
import net.gear2net.api.mobile.wifi.exception.G2NWrongWifiListIndexException;
import net.gear2net.framework.object.G2NObject;
import android.net.wifi.ScanResult;

public class G2NWifiList extends G2NObject
{

	/**
	 * "Enum Value" = null;
	 */

	private ReentrantLock mLock = new ReentrantLock();

	private List<G2NWifiInfo> mWifiList = null;
	private int mWifiListSize = -1;

	G2NWifiList(List<ScanResult> list)
	{
		mLock.lock();
		setIsNew();
		mWifiList = new ArrayList<G2NWifiInfo>();
		for ( ScanResult result : list )
		{
			mWifiList.add(new G2NWifiInfo(result.SSID, result.BSSID, result.level));
		}
		mLock.unlock();
	}

	public int getWifiListSize() throws G2NWifiException
	{

		try
		{
			mLock.lock();
			if ( mWifiList == null )
				throw new G2NWifiListNullException();
			mWifiListSize = mWifiList.size();
		}

		catch (G2NWifiException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}

		return mWifiListSize;
	}

	private boolean checkWifiListIndex(int index)
	{

		mLock.lock();
		if ( (index < 0) || (index > mWifiListSize) )
		{
			return false;
		}
		mLock.unlock();
		return true;
	}

	public G2NWifiInfo getInfo(int index) throws G2NWifiException
	{

		try
		{
			mLock.lock();

			if ( mWifiList == null )
				throw new G2NWifiListNullException();

			if ( !checkWifiListIndex(index) )
				throw new G2NWrongWifiListIndexException();
		}

		catch (G2NWifiException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}

		return mWifiList.get(index);
	}

	public Iterator<G2NWifiInfo> iterator()
	{
		return mWifiList.iterator();
	}

}
