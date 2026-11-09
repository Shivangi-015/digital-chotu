package com.digitalchotu.backend.audio;

public class AudioRequest {

    private String text;

    public AudioRequest() {
    }

    public AudioRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}