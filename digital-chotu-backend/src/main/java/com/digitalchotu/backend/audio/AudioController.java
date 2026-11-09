package com.digitalchotu.backend.audio;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audio")
@CrossOrigin(origins = "*")
public class AudioController {

    private final ElevenLabsService elevenLabsService;

    public AudioController(ElevenLabsService elevenLabsService) {
        this.elevenLabsService = elevenLabsService;
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateAudio(@RequestBody AudioRequest request)
            throws Exception {

        byte[] audio = elevenLabsService.generateSpeech(request.getText());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=speech.mp3")
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(audio);
    }
}