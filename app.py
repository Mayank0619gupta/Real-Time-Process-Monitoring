from flask import Flask, jsonify, render_template
import psutil
import time

app = Flask(_name_)

def fetch_metrics():
    cpu_overall = psutil.cpu_percent(interval=1)
    cpu_per_core = psutil.cpu_percent(interval=1, percpu=True)
    memory = psutil.virtual_memory()
    memory_data = {
        "used": round(memory.used / (1024 ** 3), 2),  # Convert to GB
        "available": round(memory.available / (1024 ** 3), 2),  # Convert to GB
        "percent": memory.percent
    }
    disk_io = psutil.disk_io_counters()
    disk_data = {
        "read_mb": round(disk_io.read_bytes / (1024 ** 2), 2),  # Convert to MB
        "write_mb": round(disk_io.write_bytes / (1024 ** 2), 2)  # Convert to MB
    }
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
        try:
            processes.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": round(proc.info['cpu_percent'], 1),
                "memory_percent": round(proc.info['memory_percent'], 1),
                "status": proc.info['status']
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    processes = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:10]
    return {
        "cpu": {"overall": cpu_overall, "per_core": cpu_per_core},
        "memory": memory_data,
        "disk_io": disk_data,
        "processes": processes,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.route('/')
def dashboard():
    metrics = fetch_metrics()
    return render_template('index.html', metrics=metrics)

@app.route('/metrics')
def get_metrics():
    return jsonify(fetch_metrics())

@app.route('/suspend/<int:pid>', methods=['POST'])
def suspend_process(pid):
    try:
        process = psutil.Process(pid)
        process.suspend()
        return jsonify({"status": "success", "message": f"Process {pid} suspended"})
    except psutil.NoSuchProcess:
        return jsonify({"status": "error", "message": f"Process {pid} not found"}), 404
    except psutil.AccessDenied:
        return jsonify({"status": "error", "message": f"Access denied to suspend process {pid}"}), 403
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/terminate/<int:pid>', methods=['POST'])
def terminate_process(pid):
    try:
        process = psutil.Process(pid)
        process.terminate()
        return jsonify({"status": "success", "message": f"Process {pid} terminated"})
    except psutil.NoSuchProcess:
        return jsonify({"status": "error", "message": f"Process {pid} not found"}), 404
    except psutil.AccessDenied:
        return jsonify({"status": "error", "message": f"Access denied to terminate process {pid}"}), 403
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/resume/<int:pid>', methods=['POST'])
def resume_process(pid):
    try:
        process = psutil.Process(pid)
        process.resume()
        return jsonify({"status": "success", "message": f"Process {pid} resumed"})
    except psutil.NoSuchProcess:
        return jsonify({"status": "error", "message": f"Process {pid} not found"}), 404
    except psutil.AccessDenied:
        return jsonify({"status": "error", "message": f"Access denied to resume process {pid}"}), 403
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if _name_ == "_main_":
    app.run(debug=True, host="localhost", port=5000)