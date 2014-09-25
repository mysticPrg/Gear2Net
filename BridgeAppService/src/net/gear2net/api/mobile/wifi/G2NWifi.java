package net.gear2net.api.mobile.wifi;

import java.util.List;
import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.api.mobile.wifi.exception.G2NWifiDisabledException;
import net.gear2net.api.mobile.wifi.exception.G2NWifiException;
import net.gear2net.framework.event.G2NEventCreator;
import net.gear2net.framework.event.G2NEventDestroyer;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.event.G2NEventListenerGroup;
import net.gear2net.framework.object.G2NObject;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.NetworkInfo.State;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;

public class G2NWifi extends G2NObject
{
	/** 
	 * "Enum Value" 
	 * 
	 * <wifiState>
	 * WIFI_STATE_ENABLED(0)
	 * WIFI_STATE_DISABLED(1)
	 * WIFI_STATE_CONNECTING(2)
	 * WIFI_STATE_CONNECTED(3)
	 * WIFI_STATE_DISCONNECTING(4)
	 * WIFI_STATE_DISCONNECTED(5)
	 */
	static private final int STATE_ENABLED = 0;
	static private final int STATE_DISABLED = 1;
	static private final int STATE_CONNECTING = 2;
	static private final int STATE_CONNECTED = 3;
	static private final int STATE_DISCONNECTING = 4;
	static private final int STATE_DISCONNECTED = 5;

	final private Lock mLock = new ReentrantLock();

	static public G2NWifi mInst = null;

	static public G2NWifi getInstance(Context context)
	{
		if ( mInst == null )
		{
			mInst = new G2NWifi(context);
		}
		return mInst;
	}

	private WifiManager mWifiManager = null;
	private ConnectivityManager mConnManager = null;

	private int mWifiState;
	State mCurrentNetworkState = null;
	State mPrevNetworkState = null;
	
	NetworkInfo mNetworkInfo = null;

	private Context mContext = null;
	
	private BroadcastReceiver mWifiStateReceiver = null;
	private BroadcastReceiver mNetworkStateReceiver = null;
	
	private G2NEventListenerGroup mWifiStateListeners = null;
	private G2NEventCreator mWifiStateCreator = null;
	private G2NEventDestroyer mWifiStateDestroyer = null;

	private G2NWifi(Context context)
	{
		mLock.lock();
		mWifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
		mConnManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
		mContext = context;
		
		mWifiStateCreator = new G2NEventCreator()
		{
			@Override
			public void onCreate()
			{
				IntentFilter wifiStateFilter = new IntentFilter(WifiManager.WIFI_STATE_CHANGED_ACTION);
				mContext.registerReceiver(mWifiStateReceiver, wifiStateFilter);
				
				IntentFilter networkStateFilter = new IntentFilter(WifiManager.NETWORK_STATE_CHANGED_ACTION);
				mContext.registerReceiver(mNetworkStateReceiver, networkStateFilter);
			}
		};
		
		mWifiStateDestroyer = new G2NEventDestroyer()
		{
			@Override
			public void onDestroy()
			{
				mContext.unregisterReceiver(mWifiStateReceiver);
				mContext.unregisterReceiver(mNetworkStateReceiver);
			}
		};
		
		mWifiStateListeners = new G2NEventListenerGroup(mWifiStateCreator, mWifiStateDestroyer);
		mWifiStateReceiver = new BroadcastReceiver()
		{

			@Override
			public void onReceive(Context context, Intent intent)
			{

				mWifiState = mWifiManager.getWifiState();

				Vector<Object> args = new Vector<Object>();

				switch ( mWifiState )
				{
					case STATE_ENABLED:
						args.add(0);
						mWifiStateListeners.onEvent(args);
						break;
						
					case STATE_DISABLED:
						args.add(1);
						mWifiStateListeners.onEvent(args);
						break;
				}

				
			}
		};


		mNetworkStateReceiver = new BroadcastReceiver()
		{

			@Override
			public void onReceive(Context context, Intent intent)
			{

				Vector<Object> args = new Vector<Object>();
				
				mNetworkInfo = mConnManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
				mCurrentNetworkState = mNetworkInfo.getState();

				if ( mPrevNetworkState != mCurrentNetworkState )
				{

					switch ( mCurrentNetworkState )
					{
						case CONNECTED:
							args.add(STATE_CONNECTED);
							break;

						case CONNECTING:
							args.add(STATE_CONNECTING);
							break;

						case DISCONNECTED:
							args.add(STATE_DISCONNECTED);
							break;

						case DISCONNECTING:
							args.add(STATE_DISCONNECTING);
							break;

						default:
							break;

					}

					mWifiStateListeners.onEvent(args);
					mPrevNetworkState = mCurrentNetworkState;
				}
			}
		};

		mLock.unlock();
	}

	public void addWifiStateChangedListener(G2NEventListener listener)
	{

		if ( listener != null )
		{
			mLock.lock();
			mWifiStateListeners.addListener(listener);
			mLock.unlock();
		}
	}

	public void removeWifiStateChangedListener(String listenerKey)
	{
		mWifiStateListeners.removeListener(listenerKey);
	}

	public boolean getWifiEnabled()
	{
		mNetworkInfo = mConnManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
		
		if ( mWifiState == STATE_ENABLED )
			return true;
		
		return false;
	}

	public void setWifiEnabled(boolean flag)
	{
		mLock.lock();
		mWifiManager.setWifiEnabled(flag);
		mLock.unlock();
	}

	public G2NWifiList getWifiList() throws G2NWifiException
	{

		mLock.lock();
		List<ScanResult> list = null;

		try
		{
			if ( mWifiManager.getWifiState() != STATE_ENABLED )
				throw new G2NWifiDisabledException();
			list = mWifiManager.getScanResults();
		}

		catch (G2NWifiException e)
		{
			throw e;
		}

		finally
		{
			mLock.unlock();
		}

		return new G2NWifiList(list);
	}

	private int getWifiId(G2NWifiList wifiList, int index) throws G2NWifiException
	{

		mLock.lock();

		WifiConfiguration wifiConf = new WifiConfiguration();

		wifiConf.SSID = "\"" + wifiList.getInfo(index).getSSID() + "\"";
		wifiConf.BSSID = wifiList.getInfo(index).getBSSID();
		wifiConf.status = WifiConfiguration.Status.ENABLED;
		wifiConf.hiddenSSID = true;

		wifiConf.allowedProtocols.set(WifiConfiguration.Protocol.RSN);
		wifiConf.allowedProtocols.set(WifiConfiguration.Protocol.WPA);
		wifiConf.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
		wifiConf.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
		wifiConf.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);
		wifiConf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP40);
		wifiConf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP104);
		wifiConf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
		wifiConf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);

		mLock.unlock();

		return mWifiManager.addNetwork(wifiConf);
	}

	public void connectWifi(G2NWifiList wifiList, int index) throws G2NWifiException
	{
		mLock.lock();
		mWifiManager.enableNetwork(getWifiId(wifiList, index), true);
		mLock.unlock();
	}

	public void disconnectWifi(G2NWifiList wifiList, int index) throws G2NWifiException
	{
		mLock.lock();
		mWifiManager.disableNetwork(getWifiId(wifiList, index));
		mLock.unlock();
	}
}
