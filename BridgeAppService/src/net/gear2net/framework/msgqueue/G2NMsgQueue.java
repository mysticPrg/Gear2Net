package net.gear2net.framework.msgqueue;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import net.gear2net.framework.G2NWidget;
import net.gear2net.framework.msg.receive.ReceiveMsg;
import net.gear2net.framework.msg.receive.StatusMsg;
import net.gear2net.framework.msg.send.ExceptionMsg;

import org.json.JSONException;

import com.samsung.android.sdk.accessory.SASocket;

public abstract class G2NMsgQueue
{
	private enum ThreadState
	{
		INIT,
		STARTED,
		SUSPENDED,
		STOPPED
	};
	
	private int mCountOfThread = 0;
	private G2NMsgConsumer mConsumers[] = null;
	BlockingQueue<ReceiveMsg> mQueue = null;
	protected SASocket mSocket = null;
	G2NWidget mWidget = null;
	
	public class G2NMsgConsumer extends Thread
	{
		volatile ThreadState mState = ThreadState.INIT;
		G2NMsgQueue mParentQueue = null;
		
		public G2NMsgConsumer(G2NMsgQueue parentQueue)
		{
			mParentQueue = parentQueue;
		}
		
		public void startFromG2N()
		{
//			synchronized ( this )
//			{
//				if ( mState != ThreadState.INIT )
//				{
//					throw new IllegalStateException("Aleady Started");
//				}
//
//				mState = ThreadState.STARTED;
			//TODO: try..
				super.start();
//			}
		}
		
		public void stopFromG2N()
		{
			synchronized ( this )
			{
				if ( mState == ThreadState.STOPPED )
				{
					throw new IllegalStateException("Aleady Stopped");
				}
				
				mState = ThreadState.STOPPED;
				interrupt();
			}
		}
		
		public void suspendFromG2N()
		{
			synchronized ( this )
			{
				switch ( mState )
				{
					case INIT:
						throw new IllegalStateException("Not Started Yet");
						
					case STARTED:
						mState = ThreadState.SUSPENDED;
						break;
						
					case STOPPED:
						throw new IllegalStateException("Already Stopped");
						
					case SUSPENDED:
						break;
				}
			}
		}
		
		public void resumeFromG2N()
		{
			synchronized ( this )
			{
				switch ( mState )
				{
					case INIT:
					case STARTED:
						break;
						
					case STOPPED:
						throw new IllegalStateException("Stopped Thread");
						
					case SUSPENDED:
						mState = ThreadState.STARTED;
						interrupt();
						break;
				}
			}
		}
		
		@Override
		public void run()
		{
			ReceiveMsg msg = null;
			while ( mState != ThreadState.STARTED )
			{
				try
				{
					while ( mState == ThreadState.SUSPENDED )
					{
						sleep(24 * 60 * 60 * 1000);
					}
					
					msg = mParentQueue.mQueue.take();
					if ( mParentQueue.run(msg) == false )
						break;
				}
				catch (InvocationTargetException e)
				{
					if ( msg != null )
					{
						sendExceptionMsg((Exception) e.getTargetException(), msg);
					}
				}
				catch (InterruptedException e)
				{
					//if ( mState != ThreadState.SUSPENDED )
				}
				catch (Exception e)
				{
					if ( msg != null )
					{
						sendExceptionMsg(e, msg);
					}
				}
			}
		}
	}

	
	public G2NMsgQueue(G2NWidget widget, int countOfThread, int capacity) throws InstantiationException, IllegalAccessException
	{
		
		mWidget = widget;
		mCountOfThread = countOfThread;
		mQueue = new ArrayBlockingQueue<ReceiveMsg>(capacity);
		
		mConsumers = new G2NMsgConsumer[mCountOfThread];
		for ( int i=0 ; i<mCountOfThread ; i++ )
		{
			mConsumers[i] = new G2NMsgConsumer(this);
		}
	}
	
	public void setSocket(SASocket socket)
	{
		mSocket = socket;
	}
	
	public void start()
	{
		for ( int i=0 ; i<mCountOfThread ; i++ )
		{
			mConsumers[i].startFromG2N();
		}
	}
	
	public void pause() throws InterruptedException
	{
		for ( int i=0 ; i<mCountOfThread ; i++ )
		{
			mConsumers[i].suspendFromG2N();
		}
	}
	
	public void resume()
	{
		for ( int i=0 ; i<mCountOfThread ; i++ )
		{
			mConsumers[i].resumeFromG2N();				
		}
	}
	
	public void destroy(StatusMsg msg) throws InterruptedException
	{
		mQueue.clear();
		for ( int i=0 ; i<mCountOfThread ; i++ )
		{
			mQueue.put(msg);
		}
	}
	
	public void put(ReceiveMsg msg) throws InterruptedException
	{
		mQueue.put(msg);
	}
	
	abstract boolean run(ReceiveMsg msg) throws JSONException,
											InstantiationException, 
											IllegalAccessException,
											InterruptedException,
											ClassNotFoundException,
											NoSuchMethodException,
											IllegalArgumentException,
											InstantiationException, 
											InvocationTargetException,
											IOException;
	
	private void sendExceptionMsg(Exception e, ReceiveMsg msg)
	{
		ExceptionMsg exceptionMsg = null;
		StatusMsg destroyMsg = null;
		G2NSystemQueue sq = null;
		try
		{
			exceptionMsg = new ExceptionMsg();
			exceptionMsg.setSocket(mSocket);
			exceptionMsg.setException(e);
			
			destroyMsg = new StatusMsg("{\"status\":\"destroy\", \"msgType\":\"STATUS\"}");
			if ( this instanceof G2NSystemQueue )
			{
				sq = (G2NSystemQueue)this;
				exceptionMsg.send(sq.getWidgetType());
			}
			else
			{
				exceptionMsg.setWidget(mWidget);
				exceptionMsg.send();
				
				G2NRequestQueue rq = (G2NRequestQueue)this;
				sq = rq.getSysQueue();
			}
			sq.forceDestroyWidget(msg.getWID(), destroyMsg);
		} catch (Exception subException)
		{
			subException.printStackTrace();
		}
	}
}
