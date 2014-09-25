package net.gear2net.api.network.http;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.object.G2NObject;

import org.json.JSONException;
import org.json.JSONObject;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Request.Method;
import com.android.volley.Response.ErrorListener;
import com.android.volley.Response.Listener;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

public class G2NHttpRequest extends G2NObject
{

	/**
	 * "Enum Value"
	 * 
	 * <RequestMethod>
	 * REQUEST_METHOD_GET(0)
	 * REQUEST_METHOD_POST(1)
	 * REQUEST_METHOD_PUT(2)
	 * REQUEST_METHOD_DELETE(3)
	 */

	final private Lock mLock = new ReentrantLock();

	private Request<String> mRequest = null;
	private G2NEventListener mOnResponseListener = null;

	public G2NHttpRequest(int method, String url, String params)
	{

		mLock.lock();

		switch ( method )
		{

			case 0:
				setGetMethod(url, params);
				break;

			case 1:
				setNoneGetMethod(url, params, Method.POST);
				break;

			case 2:
				setNoneGetMethod(url, params, Method.PUT);
				break;

			case 3:
				setNoneGetMethod(url, params, Method.DELETE);
				break;
		}
		mLock.unlock();
	}

	Request<String> getRequest()
	{
		return mRequest;
	}

	public void setResponseListener(G2NEventListener listener)
	{
		mOnResponseListener = listener;
	}

	void setGetMethod(String url, String params)
	{

		JSONObject jsonObject = null;

		try
		{
			jsonObject = new JSONObject(params);

		} catch (JSONException e)
		{
			e.printStackTrace();
		}

		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(url + "?");

		@SuppressWarnings("unchecked")
		Iterator<String> keys = jsonObject.keys();

		while (keys.hasNext())
		{
			String k = keys.next();

			try
			{
				stringBuilder.append(k);
				stringBuilder.append("=");
				stringBuilder.append(jsonObject.getString(k));
				if ( keys.hasNext() )
					stringBuilder.append("&");

			} catch (JSONException e)
			{
				e.printStackTrace();
			}

		}

		mRequest = new StringRequest(Method.GET, stringBuilder.toString(),

		new Listener<String>()
		{

			@Override
			public void onResponse(String response)
			{
				if ( mOnResponseListener == null )
				{
					// TODO : 예외 throw
				} else
				{
					Vector<Object> args = new Vector<Object>();
					args.add(response);
					mOnResponseListener.onEvent(args);
				}

			}

		}, new ErrorListener()
		{

			@Override
			public void onErrorResponse(VolleyError res)
			{
//				String exceptionMessage = res.toString();
				// TODO: 예외 throw
			}
		});
	}

	void setNoneGetMethod(String url, String params, int method)
	{

		JSONObject jsonObject = null;

		try
		{
			jsonObject = new JSONObject(params);

		} catch (JSONException e)
		{
			e.printStackTrace();
		}

		final Map<String, String> requestMap = new HashMap<String, String>();
		@SuppressWarnings("unchecked")
		Iterator<String> keys = jsonObject.keys();

		while (keys.hasNext())
		{
			String k = keys.next();

			try
			{
				requestMap.put(k, jsonObject.getString(k));

			} catch (JSONException e)
			{
				e.printStackTrace();
			}

		}

		mRequest = new StringRequest(method, url,

		new Listener<String>()
		{

			@Override
			public void onResponse(String response)
			{

				if ( mOnResponseListener == null )
				{
					// TODO : 예외 throw
				} else
				{
					Vector<Object> args = new Vector<Object>();
					args.add(response);
					mOnResponseListener.onEvent(args);
				}
			}

		}, new ErrorListener()
		{

			@Override
			public void onErrorResponse(VolleyError res)
			{
//				String exceptionMessage = res.toString();
				// TODO: 예외 throw
			}
		})
		{
			@Override
			protected Map<String, String> getParams() throws AuthFailureError
			{
				return requestMap;
			}
		};
	}
}
