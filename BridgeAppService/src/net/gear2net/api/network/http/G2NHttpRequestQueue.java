package net.gear2net.api.network.http;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.G2NContext;
import net.gear2net.framework.object.G2NObject;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

public class G2NHttpRequestQueue extends G2NObject{

	/**
	 * "Enum Value" = null
	 */

	final private Lock mLock = new ReentrantLock();

	private RequestQueue mRequestQueue = null;

	public G2NHttpRequestQueue(G2NContext context)
	{
		mLock.lock();
		mRequestQueue = Volley.newRequestQueue(context.getContext());
		mRequestQueue.stop();
		mLock.unlock();
	}

	public void addRequest(G2NHttpRequest request)
	{
		mLock.lock();
		Request<String> temp = request.getRequest();
		mRequestQueue.add(temp);
		mLock.unlock();
	}

	public void start()
	{
		mLock.lock();
		mRequestQueue.start();
		mLock.unlock();
	}

	public void stop()
	{
		mLock.lock();
		mRequestQueue.stop();
		mLock.unlock();
	}
}
