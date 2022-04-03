<?php

require_once __DIR__ . '/../vendor/tecnickcom/tcpdf/examples/tcpdf_include.php';

$resumeID = '1';

//By default everything is in mm.
//8.5"x11" in mm
$pageLayout = array(215.9, 279.4);
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $pageLayout, true, 'UTF-8', false);
$pdf->SetTitle($resumeID . '.pdf');

// remove default header/footer, might not be needed
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
$pdf->SetAutoPageBreak(false, 0);
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

$pdf->SetMargins(0, 0, 0, true);


// https://tcpdf.org/docs/srcdoc/TCPDF/classes-TCPDF/#method_setFont
$pdf->SetFont('times', '', 12);

// add a page
$pdf->AddPage();


/**
 * Write($h, $txt, $link, $fill, $align, $ln, $stretch, $firstline, $firstblock, $maxh, $wadj, $margin):
 * h - line height
 * txt - string to print
 * link - link to jump
 * fill - true: paint background, false: transparent
 * align - 'L' or '': left align, 'C': center, 'R', 'J':justify
 * ln - true:cursor at bottom of line, false: cursor at top of line
 * stretch - 0:disabled, 1: scale if larger than cell, 2 forced scale,
 * 3: character spacing if text is larger than cell, 4 forced spacing
 * $firstline - true: print 1st line and return rest, false: print all
 * $firstblock - true: then string is start of line
 * $maxh - max height, should be >= h and < remaining space, 0 to disable
 */
$pdf->SetXY(0, 0);
$pdf->Write(0, 'TopLeft', '', 0, 'L', true, 0, false, false, 0);
$pdf->SetXY(190, 0);
$pdf->Write(0, 'TopRight', '', 0, 'R', true, 0, false, false, 0);
$pdf->SetXY(0, 275);
$pdf->Write(0, 'BottomLeft', '', 0, 'L', true, 0, false, false, 0);
$pdf->SetXY(190, 275);
$pdf->Write(0, 'BottomRight', '', 0, 'R', true, 0, false, false, 0);

$text = <<<EOD
This is filler text to test page break.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam condimentum semper lacus ut lobortis. Sed urna odio, ultrices sit amet tortor vel, finibus dignissim odio. Donec bibendum, diam in tempor hendrerit, arcu risus viverra erat, nec imperdiet eros metus ac sem. Phasellus quis rutrum tellus. Donec sagittis turpis elit, id pharetra nibh euismod ac. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eget purus eros. Mauris id gravida augue, ac pellentesque neque. In et mauris ullamcorper, blandit felis nec, lacinia nunc. Vestibulum feugiat non purus vitae efficitur. Nunc sit amet lacus neque.
Phasellus nec varius quam, sed vestibulum lectus. Donec pulvinar lectus eu porttitor fermentum. Integer risus nibh, placerat id enim a, sollicitudin volutpat felis. Maecenas rhoncus orci nec nunc venenatis, in rutrum libero fringilla. Morbi ut cursus orci, quis mollis nisl. Maecenas tellus elit, iaculis in arcu at, pellentesque aliquam ante. Morbi mauris sapien, tristique id egestas sit amet, blandit in elit.
Fusce eu enim molestie, ornare erat sed, feugiat felis. Nulla facilisi. Nam elementum turpis interdum quam molestie tristique. Quisque blandit sodales arcu quis pretium. Proin tortor mauris, commodo congue hendrerit id, aliquam eu felis. Cras pretium lacus diam, vitae rhoncus elit viverra aliquet. Maecenas vitae consequat dui, eu posuere tortor. Praesent tincidunt finibus dolor. Quisque hendrerit rhoncus tempor. Curabitur hendrerit neque ac egestas laoreet. Donec at dolor sed augue luctus consectetur at vel turpis. Sed sed aliquet felis. Suspendisse efficitur lobortis placerat.
Donec posuere interdum mauris in tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean vestibulum ullamcorper neque eu tincidunt. Sed rutrum massa eu orci tempus, vel elementum neque aliquam. Fusce tempor suscipit accumsan. Sed tempus, felis sed dapibus gravida, lorem ligula bibendum odio, ut ornare turpis tortor ut purus. Nunc id volutpat purus.
Vestibulum aliquam condimentum elementum. Donec ut odio posuere, luctus lectus sed, accumsan tortor. Nullam posuere interdum justo, tempor tincidunt nunc viverra sed. Pellentesque viverra orci eu massa sagittis, sit amet feugiat ipsum volutpat. Sed rutrum ligula a mauris tincidunt pretium. In varius velit ac velit luctus, scelerisque aliquam felis varius. Ut commodo faucibus turpis in efficitur.
EOD;

$pdf->Write(0, $text, '', 0, 'L', true, 0, false, false, 0);

//Close and output PDF document
//https://tcpdf.org/docs/srcdoc/TCPDF/classes-TCPDF/#method_Output
//1st param: Name is used for filename when downloading
//2nd param: 
//'I' - view in browser with pdf viewer
//'D' - force download
//'S' - return the document as a string
//'F' - saves local file so we could do download link
ob_clean(); //flushes buffer
$file = __DIR__ . '/' . $resumeID . '.pdf';
// $pdf->Output($file, 'F'); //actual code
$pdf->Output($file, 'I'); //for debugging

// echo '/CSE442-542/2022-Spring/cse-442r/backend/api/' . $resumeID . '.pdf'
?>