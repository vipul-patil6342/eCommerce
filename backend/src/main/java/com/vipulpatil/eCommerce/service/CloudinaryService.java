package com.vipulpatil.eCommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file) throws IOException {
        if(file.isEmpty()){
            throw  new IllegalArgumentException("File is empty.");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        try{
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder","products",
                            "resource_type","image"
                    )
            );
            return uploadResult;
        } catch (IOException e) {
            throw new IOException("Failed to load image" + e.getMessage());
        }
    }

    public boolean deleteImage(String publicId) throws IOException {
        try{
            Map result = cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            throw new IOException("Failed to delete image" + e.getMessage());
        }
    }
}
