<?php

namespace App\Helpers;

class BlockValidators
{
    /**
     * getRegularTextBlockValidation
     * id - 1
     */
    public static function getRegularTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text';
        $rules['content.text'] = 'required|string|max:1000';
    }

    /**
     * getListBlockValidation
     * id -2
     * Structure: content[*].header (string), content[*].items[*].header (string), content[*].items[*].items[*] (string)
     */
    public static function getListBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array';
        $rules['content.*'] = 'required|array:header,items';
        $rules['content.*.header'] = 'required|string|max:255';
        $rules['content.*.items'] = 'nullable|array';
        $rules['content.*.items.*'] = 'required|array:header,items';
        $rules['content.*.items.*.header'] = 'required|string|max:255';
        $rules['content.*.items.*.items'] = 'nullable|array';
        $rules['content.*.items.*.items.*'] = 'nullable|string|max:255';
    }

    /**
     * getLinksBlockValidation
     * id - 3
     */
    public static function getLinksBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array';
        $rules['content.*'] = 'required|array:text,url';
        $rules['content.*.text'] = 'required|string|max:255';
        $rules['content.*.url'] = 'required|string|max:255';
    }

    /**
     * getKeyValueBlockValidation
     * id - 4
     */
    public static function getKeyValueBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:colorDisplay,tableDisplay,items';
        $rules['content.tableDisplay'] = 'required|boolean';
        $rules['content.colorDisplay'] = 'required|boolean';
        $rules['content.items'] = 'required|array';
        $rules['content.items.*'] = 'required|array:key,value';
        $rules['content.items.*.key'] = 'required|string|max:255';
        $rules['content.items.*.value'] = 'required|string|max:255';
    }

    /**
     * getHeadingTextBlockValidation
     * id - 5
     */
    public static function getHeadingTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text,colorDisplay';
        $rules['content.text'] = 'required|string|max:255';
        $rules['content.colorDisplay'] = 'required|boolean';
    }

    /**
     * getDisclaimerTextBlockValidation
     * id - 6
     */
    public static function getDisclaimerTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text';
        $rules['content.text'] = 'required|string|max:1000';
    }

    /**
     * getSeparatorBlockValidation
     * id - 7
     */
    public static function getSeparatorBlockValidation(array &$rules): void
    {
        $rules['content'] = 'nullable';
    }

    /**
     * getImagesBlockValidation
     * id - 9
     */
    public static function getImagesBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:images';
        $rules['content.images'] = 'required|array';
        $rules['content.images.*'] = 'required|array:path,name';
        $rules['content.images.*.path'] = 'required|string|max:255';
        $rules['content.images.*.name'] = 'required|string|max:255';
    }

    /**
     * getSubheaderTextBlockValidation
     * id - 10
     */
    public static function getSubheaderTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text';
        $rules['content.text'] = 'required|string|max:255';
    }

    /**
     * getFilesBlockValidation
     * id - 11
     */
    public static function getFilesBlockValidation(array &$rules): void
    {
        $rules['content'] = 'nullable|array:files';
        $rules['content.files'] = 'nullable|array';
        $rules['content.files.*'] = 'nullable|array:path,name';
        $rules['content.files.*.path'] = 'nullable|string|max:255';
        $rules['content.files.*.name'] = 'nullable|string|max:255';
        $rules['files'] = 'nullable|array';
        $rules['files.*'] = 'nullable|file|mimes:docx,pdf|max:10240'; // 10MB max
    }
}
