
import * as XLSX from "xlsx-js-style"
import { formatDateDDMMYYYY } from "./utils"

export const exportExcel = (
  data: Record<string, any>[],
  fileName: string
) => {
  if (!data?.length) return

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  const range = XLSX.utils.decode_range(worksheet["!ref"]!)

  // --------------------------------------------------
  // Convert complex values to readable strings
  // --------------------------------------------------

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_cell({ r: row, c: col })
      const cell = worksheet[address]

      if (!cell) continue

      if (cell.v === null || cell.v === undefined) {
        cell.v = ""
        cell.t = "s"
      } else if (typeof cell.v === "object") {
        cell.v = Array.isArray(cell.v)
          ? cell.v.join(", ")
          : JSON.stringify(cell.v)
        cell.t = "s"
      }
    }
  }

  // --------------------------------------------------
  // Automatically calculate column widths
  // --------------------------------------------------

  const columns = []

  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxLength = 0

    for (let row = range.s.r; row <= range.e.r; row++) {
      const address = XLSX.utils.encode_cell({
        r: row,
        c: col,
      })

      const cell = worksheet[address]

      if (!cell) continue

      const value = String(cell.v ?? "")

      maxLength = Math.max(maxLength, value.length)
    }

    // Add extra space around the content
    const width = maxLength + 6

    columns.push({
      // Keep columns from becoming too small or huge
      wch: Math.min(Math.max(width, 14), 40),
    })
  }

  worksheet["!cols"] = columns

  // --------------------------------------------------
  // Row height
  // --------------------------------------------------

  worksheet["!rows"] = Array.from(
    { length: range.e.r + 1 },
    () => ({
      hpt: 28,
    })
  )

  // Slightly larger header
  worksheet["!rows"][0] = {
    hpt: 34,
  }

  // --------------------------------------------------
  // Header styling
  // --------------------------------------------------

  for (let col = range.s.c; col <= range.e.c; col++) {
    const address = XLSX.utils.encode_cell({
      r: 0,
      c: col,
    })

    const cell = worksheet[address]

    if (!cell) continue

    cell.s = {
      font: {
        bold: true,
        sz: 12,
        color: {
          rgb: "161c48",
        },
      },

      fill: {
        fgColor: {
          rgb: "f9f9f9",
        },
      },

      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },

      border: {
        top: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        bottom: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        left: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        right: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
      },
    }
  }

  // --------------------------------------------------
  // Body styling
  // --------------------------------------------------

  for (let row = 1; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_cell({
        r: row,
        c: col,
      })

      const cell = worksheet[address]

      if (!cell) continue

      cell.s = {
        font: {
          sz: 11,
          color: {
            rgb: "111827",
          },
        },

        fill: {
          fgColor: {
            // Alternating row background
            rgb: row % 2 === 0
              ? "F8F8F8"
              : "FFFFFF",
          },
        },

        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },

        border: {
          top: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
          bottom: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
          left: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
          right: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
        },
      }
    }
  }


  // --------------------------------------------------
  // Status styling
  // --------------------------------------------------

  const statusColumnIndex = Object.keys(data[0]).findIndex(
    (key) => key.toLowerCase() === "status"
  )

  if (statusColumnIndex !== -1) {
    for (let row = 1; row <= range.e.r; row++) {
      const address = XLSX.utils.encode_cell({
        r: row,
        c: statusColumnIndex,
      })

      const cell = worksheet[address]

      if (!cell) continue

      const status = String(cell.v ?? "").toLowerCase()

      if (status === "active") {
        cell.s = {
          ...cell.s,

          font: {
            bold: true,
            sz: 11,
            color: {
              rgb: "15803D",
            },
          },

          fill: {
            fgColor: {
              rgb: "DCFCE7",
            },
          },

          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        }
      }

      if (status === "suspended") {
        cell.s = {
          ...cell.s,

          font: {
            bold: true,
            sz: 11,
            color: {
              rgb: "B91C1C",
            },
          },

          fill: {
            fgColor: {
              rgb: "FEE2E2",
            },
          },

          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        }
      }
    }
  }

  // --------------------------------------------------
  // Link/Unlink Styling
  // --------------------------------------------------

  for (let row = 1; row <= range.e.r; row++) {
    const address = XLSX.utils.encode_cell({
      r: row,
      c: 3, // Linked Status column
    })

    const cell = worksheet[address]

    if (!cell) continue

    if (cell.v === "✓ Linked") {
      cell.s = {
        ...cell.s,

        font: {
          bold: true,
          color: {
            rgb: "15803D",
          },
        },

        // fill: {
        //   fgColor: {
        //     rgb: "DCFCE7",
        //   },
        // },

        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      }
    }

    if (cell.v === "✕ Unlinked") {
      cell.s = {
        ...cell.s,

        font: {
          bold: true,
          color: {
            rgb: "B91C1C",
          },
        },

        // fill: {
        //   fgColor: {
        //     rgb: "FEE2E2",
        //   },
        // },

        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      }
    }
  }

  // --------------------------------------------------
  // Auto filter
  // --------------------------------------------------

  worksheet["!autofilter"] = {
    ref: worksheet["!ref"]!,
  }

  // --------------------------------------------------
  // Freeze header row
  // --------------------------------------------------

  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 1,
  }

  // --------------------------------------------------
  // Create Excel file
  // --------------------------------------------------

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

  XLSX.writeFile(workbook, fileName + "-" + formatDateDDMMYYYY(new Date()) + ".xlsx")
}

export type MonitorExportTone = "success" | "warning" | "error" | "neutral"

type MonitorExportCellTones = Record<string, MonitorExportTone>

const monitorToneStyles: Record<MonitorExportTone, { fill: string; font: string }> = {
  success: { fill: "EDF7F0", font: "308446" },
  warning: { fill: "FFF1E8", font: "E15501" },
  error: { fill: "FDECEC", font: "CC0605" },
  neutral: { fill: "F3F4F6", font: "737792" },
}

export const exportMonitorExcel = (
  data: Record<string, any>[],
  fileName: string,
  cellTones: MonitorExportCellTones[] = []
) => {
  if (!data?.length) return

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  const range = XLSX.utils.decode_range(worksheet["!ref"]!)

  // --------------------------------------------------
  // Convert complex values to readable strings
  // --------------------------------------------------

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_cell({ r: row, c: col })
      const cell = worksheet[address]

      if (!cell) continue

      if (cell.v === null || cell.v === undefined) {
        cell.v = ""
        cell.t = "s"
      } else if (typeof cell.v === "object") {
        cell.v = Array.isArray(cell.v)
          ? cell.v.join(", ")
          : JSON.stringify(cell.v)
        cell.t = "s"
      }
    }
  }

  // --------------------------------------------------
  // Automatically calculate column widths
  // --------------------------------------------------

  const columns = []

  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxLength = 0

    for (let row = range.s.r; row <= range.e.r; row++) {
      const address = XLSX.utils.encode_cell({
        r: row,
        c: col,
      })

      const cell = worksheet[address]

      if (!cell) continue

      const value = String(cell.v ?? "")

      maxLength = Math.max(maxLength, value.length)
    }

    // Add extra space around the content
    const width = maxLength + 6

    columns.push({
      // Keep columns from becoming too small or huge
      wch: Math.min(Math.max(width, 14), 40),
    })
  }

  worksheet["!cols"] = columns

  // --------------------------------------------------
  // Row height
  // --------------------------------------------------

  worksheet["!rows"] = Array.from(
    { length: range.e.r + 1 },
    () => ({
      hpt: 28,
    })
  )

  // Slightly larger header
  worksheet["!rows"][0] = {
    hpt: 34,
  }

  // --------------------------------------------------
  // Header styling
  // --------------------------------------------------

  for (let col = range.s.c; col <= range.e.c; col++) {
    const address = XLSX.utils.encode_cell({
      r: 0,
      c: col,
    })

    const cell = worksheet[address]

    if (!cell) continue

    cell.s = {
      font: {
        bold: true,
        sz: 12,
        color: {
          rgb: "161c48",
        },
      },

      fill: {
        fgColor: {
          rgb: "f9f9f9",
        },
      },

      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },

      border: {
        top: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        bottom: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        left: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
        right: {
          style: "thin",
          color: { rgb: "D1D5DB" },
        },
      },
    }
  }

  // --------------------------------------------------
  // Body styling
  // --------------------------------------------------

  for (let row = 1; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_cell({
        r: row,
        c: col,
      })

      const cell = worksheet[address]

      if (!cell) continue

      cell.s = {
        font: {
          sz: 11,
          color: {
            rgb: "111827",
          },
        },

        fill: {
          fgColor: {
            // Alternating row background
            rgb: row % 2 === 0
              ? "F8F8F8"
              : "FFFFFF",
          },
        },

        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },

        border: {
          top: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
          bottom: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
          left: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
          right: {
            style: "thin",
            color: { rgb: "E5E7EB" },
          },
        },
      }
    }
  }


  // --------------------------------------------------
  // Monitor badge styling
  // --------------------------------------------------

  const columnIndexes = Object.fromEntries(
    Object.keys(data[0]).map((key, index) => [key, index])
  )

  cellTones.forEach((rowTones, dataIndex) => {
    Object.entries(rowTones).forEach(([columnName, tone]) => {
      const columnIndex = columnIndexes[columnName]
      if (columnIndex === undefined) return

      const cell = worksheet[XLSX.utils.encode_cell({
        r: dataIndex + 1,
        c: columnIndex,
      })]
      if (!cell) return

      const style = monitorToneStyles[tone]
      cell.s = {
        ...cell.s,
        font: {
          ...cell.s?.font,
          bold: true,
          color: { rgb: style.font },
        },
        fill: {
          fgColor: { rgb: style.fill },
        },
      }
    })
  })

  // --------------------------------------------------
  // Auto filter
  // --------------------------------------------------

  worksheet["!autofilter"] = {
    ref: worksheet["!ref"]!,
  }

  // --------------------------------------------------
  // Freeze header row
  // --------------------------------------------------

  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 1,
  }

  // --------------------------------------------------
  // Create Excel file
  // --------------------------------------------------

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

  XLSX.writeFile(workbook, fileName + "-" + formatDateDDMMYYYY(new Date()) + ".xlsx")
}
