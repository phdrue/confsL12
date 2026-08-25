<?php

namespace App\Exports\PhpWord;

use PhpOffice\PhpWord\Writer\PDF\DomPDF;

class LandscapeDomPdfWriter extends DomPDF
{
    public function save(string $filename): void
    {
        $fileHandle = parent::prepareForSave($filename);

        $pdf = $this->createExternalWriterInstance();
        $pdf->setPaper('a4', 'landscape');
        $pdf->loadHtml(str_replace(PHP_EOL, '', $this->getContent()));
        $pdf->render();

        fwrite($fileHandle, $pdf->output());

        parent::restoreStateAfterSave($fileHandle);
    }
}
