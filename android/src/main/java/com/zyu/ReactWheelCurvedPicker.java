package com.zyu;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Shader;

import com.aigestudio.wheelpicker.view.WheelCurvedPicker;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class ReactWheelCurvedPicker extends WheelCurvedPicker {

    private final EventDispatcher mEventDispatcher;
    private List<Integer> mValueData;
    private Integer paintColor;
    private boolean ignoreTextHeight;

    public ReactWheelCurvedPicker(ReactContext reactContext) {
        super(reactContext);
        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        setOnWheelChangeListener(new OnWheelChangeListener() {
            @Override
            public void onWheelScrolling(float deltaX, float deltaY) {
            }

            @Override
            public void onWheelSelected(int index, String data) {
                if (mValueData != null && index < mValueData.size()) {
                    mEventDispatcher.dispatchEvent(
                            new ItemSelectedEvent(getId(), mValueData.get(index)));
                }
            }

            @Override
            public void onWheelScrollStateChanged(int state) {
            }
        });
    }

    @Override
    protected void drawForeground(Canvas canvas) {
        super.drawForeground(canvas);

        Paint paint = new Paint();
        if (paintColor != null) {
            paint.setColor(paintColor);
        } else {
            paint.setColor(Color.WHITE);
            int colorFrom = 0x00FFFFFF;//Color.BLACK;
            int colorTo = Color.WHITE;
            LinearGradient linearGradientShader = new LinearGradient(rectCurItem.left, rectCurItem.top, rectCurItem.right / 2, rectCurItem.top, colorFrom, colorTo, Shader.TileMode.MIRROR);
            paint.setShader(linearGradientShader);
        }

        Rect rect = rectCurItem;
        if (ignoreTextHeight) {
            // fix �����ֻ���ʾ�߶ȹ���
            int centerY = (rectCurItem.top + rectCurItem.bottom) / 2;
            rect = new Rect(rectCurItem.left, centerY - itemSpace / 2, rectCurItem.right, centerY + itemSpace / 2);

        }

        canvas.drawLine(rect.left, rect.top, rect.right, rect.top, paint);
        canvas.drawLine(rect.left, rect.bottom, rect.right, rect.bottom, paint);
    }

    public void setItemSelectedTextBold(boolean isBold) {
        //super.setItemSelectedTextBold(isBold);
    }

    public void setItemLineColor(Integer color) {
        paintColor = color;
    }

    @Override
    public void setItemIndex(int index) {
        super.setItemIndex(index);
        unitDeltaTotal = 0;
        mHandler.post(this);
    }

    public boolean isIgnoreTextHeight() {
        return ignoreTextHeight;
    }

    public void setIgnoreTextHeight(boolean ignoreTextHeight) {
        this.ignoreTextHeight = ignoreTextHeight;
    }

    public void setValueData(List<Integer> data) {
        mValueData = data;
    }

    public int getState() {
        return state;
    }
}

class ItemSelectedEvent extends Event<ItemSelectedEvent> {

    public static final String EVENT_NAME = "wheelCurvedPickerPageSelected";

    private final int mValue;

    protected ItemSelectedEvent(int viewTag, int value) {
        super(viewTag);
        mValue = value;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("data", mValue);
        return eventData;
    }
}
