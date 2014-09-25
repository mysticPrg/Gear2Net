package net.gear2net.framework.msgqueue;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import net.gear2net.framework.G2NWidget;
import net.gear2net.framework.G2NWidget.WidgetType;
import net.gear2net.framework.msg.receive.ReceiveMsg;
import net.gear2net.framework.msg.receive.StatusMsg;
import net.gear2net.framework.msg.send.ReturnCallResultMsg;

import org.json.JSONException;

import android.content.Context;

public class G2NSystemQueue extends G2NMsgQueue
{
	private static final int REQUEST_QUEUE_CAPACITY = 20;

	private Map<String, G2NWidget> mWidgetTable = null;
	private Context mContext = null;
	private WidgetType mWidgetType;

	public G2NSystemQueue(Context context, WidgetType widgetType, int capacity) throws InstantiationException, IllegalAccessException
	{
		super(null, 1, capacity);
		mWidgetType = widgetType;
		mContext = context;
		mWidgetTable = new HashMap<String, G2NWidget>();
	}

	public WidgetType getWidgetType()
	{
		return mWidgetType;
	}

	public void forceDestroyWidget(String wID, StatusMsg msg) throws InterruptedException
	{
		mWidgetTable.get(wID).destroy(msg);
		mWidgetTable.remove(wID);
	}

	@Override
	boolean run(ReceiveMsg msg) throws JSONException, InstantiationException, IllegalAccessException, InterruptedException, IOException
	{
		switch ( msg.getType() )
		{
			case STATUS:
				onStatusMsg((StatusMsg) msg);
				break;
			default:
				mWidgetTable.get(msg.getWID()).sendMsg(msg);
				break;
		}

		return true;
	}

	private void onStatusMsg(StatusMsg msg) throws JSONException, InstantiationException, IllegalAccessException, InterruptedException, IOException
	{
		String status = msg.getStatus();
		if ( "create".equals(status) )
			onCreateWidget(msg);
		else if ( "resume".equals(status) )
			onResumeWidget(msg);
		else if ( "pause".equals(status) )
			onPauseWidget(msg);
		else if ( "destroy".equals(status) )
			onDestroyWidget(msg);
	}

	private void onCreateWidget(StatusMsg msg) throws JSONException, InstantiationException, IllegalAccessException, IOException
	{
		G2NWidget newWidget = new G2NWidget(mContext, mSocket, this, msg.getWID(), mWidgetType, msg.getCountOfThread(), REQUEST_QUEUE_CAPACITY);
		mWidgetTable.put(msg.getWID(), newWidget);

		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn("null");
		returnMsg.setSocket(msg.getSocket());
		returnMsg.send(mWidgetType);
	}

	private void onResumeWidget(StatusMsg msg) throws JSONException, IOException
	{
		mWidgetTable.get(msg.getWID()).resume();

		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn("null");
		returnMsg.setSocket(msg.getSocket());
		returnMsg.send(mWidgetType);
	}

	private void onPauseWidget(StatusMsg msg) throws InterruptedException, JSONException, IOException
	{
		mWidgetTable.get(msg.getWID()).pause();
		
		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn("null");
		returnMsg.setSocket(msg.getSocket());
		returnMsg.send(mWidgetType);
	}

	private void onDestroyWidget(StatusMsg msg) throws InterruptedException, JSONException, IOException
	{
		String wID = msg.getWID();
		mWidgetTable.get(wID).destroy(msg);
		mWidgetTable.remove(wID);

		ReturnCallResultMsg returnMsg = new ReturnCallResultMsg();
		returnMsg.setCallbackKey(msg.getCallbackKey());
		returnMsg.setReturn("null");
		returnMsg.setSocket(msg.getSocket());
		returnMsg.send(mWidgetType);
	}
}
