package net.gear2net.framework.msgqueue;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.json.JSONException;

import net.gear2net.framework.G2NWidget;
import net.gear2net.framework.event.G2NEventListener;
import net.gear2net.framework.msg.receive.ConstructorMsg;
import net.gear2net.framework.msg.receive.DestructorMsg;
import net.gear2net.framework.msg.receive.MethodCallMsg;
import net.gear2net.framework.msg.receive.ReceiveMsg;
import net.gear2net.framework.msg.receive.RegistrationListenerMsg;
import net.gear2net.framework.msg.receive.StatusMsg;
import net.gear2net.framework.msg.receive.UnregistrationListenerMsg;
import net.gear2net.framework.msg.send.ReturnCallResultMsg;
import net.gear2net.framework.object.G2NObject;

public class G2NRequestQueue extends G2NMsgQueue
{	
	private G2NSystemQueue mSysQueue = null;
	
	public G2NRequestQueue(G2NWidget widget, G2NSystemQueue sysQueue, int countOfThread, int capacity) throws InstantiationException, IllegalAccessException
	{
		super(widget, countOfThread, capacity);
		mSysQueue = sysQueue;
	}
	
	public G2NSystemQueue getSysQueue()
	{
		return mSysQueue;
	}

	@Override
	boolean run(ReceiveMsg msg) throws JSONException, ClassNotFoundException, NoSuchMethodException, IllegalArgumentException, InstantiationException, IllegalAccessException, InvocationTargetException, IOException, InterruptedException
	{
		boolean running = true;
		switch ( msg.getType() )
		{
			case CONSTRUCTOR:
				onConstructorMsg((ConstructorMsg)msg);
				break;
			case DESTRUCTOR:
				onDestructorMsg((DestructorMsg)msg);
				break;
			case METHOD_CALL:
				onMethodCallMsg((MethodCallMsg)msg);
				break;
			case STATUS:
				running = onStatusMsg((StatusMsg)msg);
				break;
			case REGISTRATION_LISTENER:
				onRegistrationListenerMsg((RegistrationListenerMsg)msg);
				break;
			case UNRESISTRATION_LISTENER:
				onUnregistrationListenerMsg((UnregistrationListenerMsg)msg);
				break;
			default:
				break;
		}
		
		return running;
	}
	

	private void onConstructorMsg(ConstructorMsg msg) throws JSONException, ClassNotFoundException, NoSuchMethodException, IllegalArgumentException, InstantiationException, IllegalAccessException, InvocationTargetException, IOException, InterruptedException
	{
		if ( msg.isOldMsg() )
		{
			return;
		}
		
		if ( msg.isContainsNonCreatedArguments() )
		{
			msg.rePutToRequestQueue();
			return;
		}
		
		@SuppressWarnings("unchecked")
		Class<? extends G2NObject> g2nClass = (Class<? extends G2NObject>)Class.forName(msg.getClassname());
		Constructor<? extends G2NObject> constructor = g2nClass.getConstructor(msg.getParameterTypes());		
		G2NObject obj = constructor.newInstance(msg.getArgs().toArray());
		
		msg.putG2NObjectToWidget(obj);
		
		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn(0);
		returnMsg.setSocket(msg.getSocket());
		returnMsg.setWidget(mWidget);
		returnMsg.send();
	}
	
	private void onDestructorMsg(DestructorMsg msg) throws JSONException, IOException
	{
		mWidget.removeObject(msg.getObjKey());
		
		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn(0);
		returnMsg.setSocket(msg.getSocket());
		returnMsg.setWidget(mWidget);
		returnMsg.send();
	}
	
	private void onMethodCallMsg(MethodCallMsg msg) throws JSONException, NoSuchMethodException, IllegalArgumentException, IllegalAccessException, InvocationTargetException, IOException, InterruptedException
	{
		if ( msg.isOldMsg() )
		{
			return;
		}
		
		if ( msg.isContainsNonCreatedObjectKey() || msg.isContainsNonCreatedArguments() )
		{
			msg.rePutToRequestQueue();
			return;
		}
		
		G2NObject obj = msg.getObject();
		Class<? extends G2NObject> g2nClass = obj.getClass();
		Method method = g2nClass.getMethod(msg.getFunc(), msg.getParameterTypes());
		Object returnValue = method.invoke(obj, msg.getArgs().toArray());
		
		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn(returnValue);
		returnMsg.setSocket(msg.getSocket());
		returnMsg.setWidget(mWidget);
		returnMsg.send();
	}
	
	private boolean onStatusMsg(StatusMsg msg) throws JSONException
	{		
		if ( "destroy".equals(msg.getStatus()) )
		{
			return false;
		}
		return true;
	}
	
	private void onRegistrationListenerMsg(RegistrationListenerMsg msg) throws JSONException, InterruptedException, NoSuchMethodException, IllegalArgumentException, IllegalAccessException, InvocationTargetException, IOException
	{
		if ( msg.isOldMsg() )
		{
			return;
		}
		
		if ( msg.isContainsNonCreatedObjectKey() )
		{
			msg.rePutToRequestQueue();
			return;
		}
		
		G2NEventListener listener = new G2NEventListener(msg.getListenerKey(), msg.getSocket(), mWidget);
		
		mWidget.addEventListener(msg.getListenerKey(), listener);
		
		G2NObject obj = msg.getObject();
		Class<? extends G2NObject> g2nClass = obj.getClass();
		Method method = g2nClass.getMethod(msg.getFunc(), G2NEventListener.class);
		method.invoke(obj, listener);
		
		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn(msg.getListenerKey());
		returnMsg.setSocket(msg.getSocket());
		returnMsg.setWidget(mWidget);
		returnMsg.send();
	}
	
	private void onUnregistrationListenerMsg(UnregistrationListenerMsg msg) throws JSONException, InterruptedException, NoSuchMethodException, IllegalArgumentException, IllegalAccessException, InvocationTargetException, IOException
	{
		if ( msg.isOldMsg() )
		{
			return;
		}
		
		if ( msg.isContainsNonCreatedObjectKey() )
		{
			msg.rePutToRequestQueue();
			return;
		}
		
		mWidget.removeEventListener(msg.getListenerKey());
		
		G2NObject obj = msg.getObject();
		Class<? extends G2NObject> g2nClass = obj.getClass();
		Method method = g2nClass.getMethod(msg.getFunc(), String.class);
		Object returnValue = method.invoke(obj, msg.getListenerKey());

		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn(returnValue);
		returnMsg.setSocket(msg.getSocket());
		returnMsg.setWidget(mWidget);
		returnMsg.send();
	}

}
