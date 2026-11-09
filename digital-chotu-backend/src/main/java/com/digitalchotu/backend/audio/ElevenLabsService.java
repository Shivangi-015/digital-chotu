package com.digitalchotu.backend.audio;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ElevenLabsService {

    @Value("${elevenlabs.api.key}")
    private String apiKey;

    @Value("${elevenlabs.voice.id}")
    private String voiceId;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public byte[] generateSpeech(String text) throws IOException, InterruptedException {

        String requestBody = """
                {
                  "text": "%s",
                  "model_id": "eleven_multilingual_v2"
                }
                """.formatted(
                text.replace("\"", "\\\"")
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.elevenlabs.io/v1/text-to-speech/" + voiceId))
                .header("Accept", "audio/mpeg")
                .header("Content-Type", "application/json")
                .header("xi-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<byte[]> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

        if (response.statusCode() != 200) {
            throw new RuntimeException(
                    "ElevenLabs Error: "
                            + response.statusCode()
                            + " "
                            + new String(response.body())
            );
        }

        return response.body();
    }
}