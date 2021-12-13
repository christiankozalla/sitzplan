import { jsPDF } from "jspdf";
import { controller } from "../lib/Controller";

export const generatePdf = () => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm" });
  const today = new Date();

  const rows = controller.getDimension("rows");
  const columns = controller.getDimension("cols");
  const className = controller.getClassName();
  const roomName = controller.getRoomName();
  const fields = controller.getFields();

  // First row with Headline, room and class name and Date
  doc.text("Dein Sitzplan", 10, 10);
  doc.text(`Raum ${roomName}`, 120, 10);
  doc.text(`Klasse ${className}`, 160, 10);
  doc.text(
    `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${today.getFullYear()}`,
    260,
    10
  );

  fields.forEach(({ position: [x, y], isTable, student }) => {
    const currentX = 25 * x + 10;
    const currentY = 18 * y;
    if (isTable) {
      doc.rect(currentX, currentY, 25, 18);
    }

    if (student) {
      doc.text(`${student.name}`, currentX, currentY + 5);
    }
  });
  doc.save("dein-sitzplan.pdf");
};
