import os
import sys
import tkinter as tk
from tkinter import messagebox, filedialog, ttk
import json
import threading
import time
from pathlib import Path

try:
    import win32com.client
except ImportError:
    messagebox.showerror("Missing Module", "Please install pywin32: pip install pywin32")
    sys.exit(1)

class ShortcutGeneratorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("◆ HACKER'S SHORTCUT GENERATOR v2.0 ◆")
        self.root.geometry("900x700")
        self.root.configure(bg="#0a0a0a")
        self.root.minsize(700, 500)
        
        # Enhanced tool library with more categories
        self.tools = {
            "Programming": [
                {"name": "Visual Studio Code", "path": r"C:\Program Files\Microsoft VS Code\Code.exe"},
                {"name": "PyCharm", "path": r"C:\Program Files\JetBrains\PyCharm\bin\pycharm64.exe"},
                {"name": "Sublime Text", "path": r"C:\Program Files\Sublime Text\sublime_text.exe"},
                {"name": "Notepad++", "path": r"C:\Program Files\Notepad++\notepad++.exe"}
            ],
            "Network Scanners": [
                {"name": "Nmap", "path": r"C:\Program Files (x86)\Nmap\nmap.exe"},
                {"name": "Wireshark", "path": r"C:\Program Files\Wireshark\Wireshark.exe"},
                {"name": "Angry IP Scanner", "path": r"C:\Program Files\Angry IP Scanner\ipscan.exe"}
            ],
            "Security Tools": [
                {"name": "Burp Suite", "path": r"C:\Program Files\BurpSuite\burpsuite.jar"},
                {"name": "OWASP ZAP", "path": r"C:\Program Files\OWASP\ZAP\zap.exe"},
                {"name": "Metasploit", "path": r"C:\metasploit\console.bat"}
            ],
            "System Tools": [
                {"name": "Process Hacker", "path": r"C:\Program Files\Process Hacker 2\ProcessHacker.exe"},
                {"name": "HxD Hex Editor", "path": r"C:\Program Files\HxD\HxD.exe"},
                {"name": "Sysinternals Suite", "path": r"C:\Tools\Sysinternals\procexp.exe"}
            ],
            "Terminals": [
                {"name": "Windows Terminal", "path": r"C:\Program Files\WindowsApps\Microsoft.WindowsTerminal\wt.exe"},
                {"name": "PuTTY", "path": r"C:\Program Files\PuTTY\putty.exe"},
                {"name": "Git Bash", "path": r"C:\Program Files\Git\git-bash.exe"}
            ]
        }
        
        self.checkboxes = {}
        self.animation_running = True
        self.setup_styles()
        self.create_widgets()
        self.start_animations()
        self.load_auto_config()
        
    def setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Enhanced hacker aesthetic with neon accents
        self.colors = {
            'bg': '#0a0a0a',
            'bg_secondary': '#1a1a1a',
            'bg_tertiary': '#2a2a2a',
            'primary': '#00ff41',  # Matrix green
            'danger': '#ff0040',   # Neon red
            'warning': '#ffaa00',  # Amber
            'info': '#00ffff',     # Cyan
            'text': '#e0e0e0',
            'text_dim': '#808080'
        }
        
        # Configure ttk styles
        self.style.configure('Main.TFrame', background=self.colors['bg'])
        
        self.style.configure('TButton',
                           background=self.colors['bg_tertiary'],
                           foreground=self.colors['primary'],
                           padding=(10, 6),
                           font=('Consolas', 10, 'bold'),
                           borderwidth=1,
                           relief='flat')
        self.style.map('TButton',
                      background=[('active', self.colors['primary']), ('pressed', '#00cc33')],
                      foreground=[('active', self.colors['bg']), ('pressed', self.colors['bg'])])
        
        self.style.configure('Danger.TButton',
                           foreground=self.colors['danger'])
        self.style.map('Danger.TButton',
                      background=[('active', self.colors['danger'])],
                      foreground=[('active', self.colors['bg'])])
        
        self.style.configure('TLabel',
                           background=self.colors['bg'],
                           foreground=self.colors['text'],
                           font=('Consolas', 10))
        
        self.style.configure('TEntry',
                           fieldbackground=self.colors['bg_tertiary'],
                           foreground=self.colors['primary'],
                           insertcolor=self.colors['primary'],
                           borderwidth=1,
                           relief='flat')
        self.style.map('TEntry',
                      fieldbackground=[('focus', '#003300')],
                      selectbackground=[('focus', self.colors['primary'])])
        
        self.style.configure('Category.TLabel',
                           font=('Consolas', 12, 'bold'),
                           foreground=self.colors['info'],
                           padding=5)
        
        self.style.configure('TCheckbutton',
                           background=self.colors['bg_secondary'],
                           foreground=self.colors['text'],
                           font=('Consolas', 9),
                           focuscolor='none')
        self.style.map('TCheckbutton',
                      background=[('active', self.colors['bg_tertiary'])],
                      foreground=[('selected', self.colors['primary'])])
        
        self.style.configure('Vertical.TScrollbar',
                           background=self.colors['bg_tertiary'],
                           troughcolor=self.colors['bg_secondary'],
                           borderwidth=0,
                           arrowcolor=self.colors['primary'],
                           darkcolor=self.colors['bg_tertiary'],
                           lightcolor=self.colors['bg_tertiary'])
        
    def create_widgets(self):
        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_rowconfigure(0, weight=1)
        
        main_frame = ttk.Frame(self.root, padding="20", style='Main.TFrame')
        main_frame.grid(row=0, column=0, sticky="nsew")
        main_frame.grid_columnconfigure(0, weight=1)
        main_frame.grid_rowconfigure(2, weight=1)
        
        # ASCII art header
        header_frame = ttk.Frame(main_frame, style='Main.TFrame')
        header_frame.grid(row=0, column=0, sticky="ew", pady=(0, 20))
        
        ascii_art = """╔══════════════════════════════════════════╗
║  HACKER'S SHORTCUT GENERATOR v2.0        ║
║  [SYSTEM READY] [TOOLS LOADED]           ║
╚══════════════════════════════════════════╝"""
        
        self.header_label = tk.Label(
            header_frame,
            text=ascii_art,
            font=('Consolas', 11, 'bold'),
            fg=self.colors['primary'],
            bg=self.colors['bg'],
            justify='left'
        )
        self.header_label.pack()
        
        # Control panel
        control_frame = ttk.Frame(main_frame, style='Main.TFrame')
        control_frame.grid(row=1, column=0, sticky="ew", pady=(0, 15))
        control_frame.grid_columnconfigure(1, weight=1)
        
        # Search bar with icon
        search_label = ttk.Label(control_frame, text="[SEARCH]►", foreground=self.colors['info'])
        search_label.grid(row=0, column=0, padx=(0, 10))
        
        self.search_var = tk.StringVar()
        self.search_var.trace('w', self.filter_tools)
        search_entry = ttk.Entry(control_frame, textvariable=self.search_var, font=('Consolas', 10))
        search_entry.grid(row=0, column=1, sticky="ew", padx=(0, 10))
        
        # Tool counters
        self.counter_label = ttk.Label(control_frame, text="", foreground=self.colors['text_dim'])
        self.counter_label.grid(row=0, column=2)
        
        # Add custom tool button
        add_tool_btn = ttk.Button(control_frame, text="+ ADD TOOL", command=self.add_custom_tool)
        add_tool_btn.grid(row=0, column=3, padx=10)
        
        # Scrollable tool list with border
        list_frame = tk.Frame(main_frame, bg=self.colors['primary'], bd=1)
        list_frame.grid(row=2, column=0, sticky="nsew")
        
        canvas_frame = ttk.Frame(list_frame, style='Main.TFrame')
        canvas_frame.pack(fill="both", expand=True, padx=1, pady=1)
        canvas_frame.grid_columnconfigure(0, weight=1)
        canvas_frame.grid_rowconfigure(0, weight=1)
        
        self.canvas = tk.Canvas(canvas_frame, bg=self.colors['bg_secondary'], 
                               highlightthickness=0, bd=0)
        scrollbar = ttk.Scrollbar(canvas_frame, orient="vertical", 
                                 command=self.canvas.yview, style='Vertical.TScrollbar')
        self.scrollable_frame = ttk.Frame(self.canvas, style='Main.TFrame')
        self.scrollable_frame.configure(style='Main.TFrame')
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        
        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)
        
        self.canvas.grid(row=0, column=0, sticky="nsew")
        scrollbar.grid(row=0, column=1, sticky="ns")
        
        # Mouse wheel binding
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        
        # Output configuration
        output_frame = ttk.Frame(main_frame, style='Main.TFrame')
        output_frame.grid(row=3, column=0, sticky="ew", pady=15)
        output_frame.grid_columnconfigure(1, weight=1)
        
        output_label = ttk.Label(output_frame, text="[OUTPUT]►", foreground=self.colors['warning'])
        output_label.grid(row=0, column=0, padx=(0, 10))
        
        self.output_var = tk.StringVar(value=os.path.join(os.path.expanduser("~"), "Desktop", "HackerTools"))
        output_entry = ttk.Entry(output_frame, textvariable=self.output_var, font=('Consolas', 10))
        output_entry.grid(row=0, column=1, sticky="ew", padx=(0, 10))
        
        browse_btn = ttk.Button(output_frame, text="BROWSE", command=self.browse_directory)
        browse_btn.grid(row=0, column=2)
        
        # Action buttons
        button_frame = ttk.Frame(main_frame, style='Main.TFrame')
        button_frame.grid(row=4, column=0, sticky="ew", pady=10)
        button_frame.grid_columnconfigure((0, 1, 2, 3, 4), weight=1)
        
        generate_btn = ttk.Button(button_frame, text="◆ GENERATE", command=self.generate_shortcuts)
        generate_btn.grid(row=0, column=0, padx=5, sticky="ew")
        
        select_all_btn = ttk.Button(button_frame, text="SELECT ALL", command=self.select_all)
        select_all_btn.grid(row=0, column=1, padx=5, sticky="ew")
        
        clear_btn = ttk.Button(button_frame, text="CLEAR", command=self.clear_selection, style='Danger.TButton')
        clear_btn.grid(row=0, column=2, padx=5, sticky="ew")
        
        save_btn = ttk.Button(button_frame, text="SAVE CFG", command=self.save_config)
        save_btn.grid(row=0, column=3, padx=5, sticky="ew")
        
        load_btn = ttk.Button(button_frame, text="LOAD CFG", command=self.load_config)
        load_btn.grid(row=0, column=4, padx=5, sticky="ew")
        
        # Status bar with animation
        status_frame = tk.Frame(main_frame, bg=self.colors['bg_tertiary'], bd=1, relief='sunken')
        status_frame.grid(row=5, column=0, sticky="ew", pady=(10, 0))
        
        self.status_var = tk.StringVar(value="[SYSTEM READY]")
        self.status_label = tk.Label(
            status_frame,
            textvariable=self.status_var,
            bg=self.colors['bg_tertiary'],
            fg=self.colors['primary'],
            font=('Consolas', 9),
            anchor="w",
            padx=10,
            pady=5
        )
        self.status_label.pack(fill="x")
        
        # Progress bar (hidden by default)
        self.progress = ttk.Progressbar(main_frame, mode='determinate', length=200)
        
        self.populate_tools()
        self.update_counter()
        
    def start_animations(self):
        """Start background animations"""
        def animate_header():
            colors = [self.colors['primary'], self.colors['info'], self.colors['warning']]
            i = 0
            while self.animation_running:
                if hasattr(self, 'header_label'):
                    self.header_label.config(fg=colors[i % len(colors)])
                    i += 1
                time.sleep(2)
        
        thread = threading.Thread(target=animate_header, daemon=True)
        thread.start()
        
    def _on_mousewheel(self, event):
        self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        
    def populate_tools(self):
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()
        
        self.checkboxes = {}
        search_term = self.search_var.get().lower()
        
        for category, tool_list in self.tools.items():
            # Filter category
            filtered_tools = [tool for tool in tool_list 
                            if not search_term or search_term in tool["name"].lower()]
            
            if not filtered_tools:
                continue
            
            # Category frame
            cat_frame = tk.Frame(self.scrollable_frame, bg=self.colors['bg_secondary'], bd=1, relief='ridge')
            cat_frame.pack(fill="x", pady=8, padx=15)
            
            # Category header
            header = tk.Frame(cat_frame, bg=self.colors['bg_tertiary'])
            header.pack(fill="x")
            
            cat_label = tk.Label(
                header,
                text=f"▼ {category.upper()} [{len(filtered_tools)}]",
                font=('Consolas', 11, 'bold'),
                fg=self.colors['info'],
                bg=self.colors['bg_tertiary'],
                padx=10,
                pady=5
            )
            cat_label.pack(anchor="w")
            
            self.checkboxes[category] = []
            
            # Tools in category
            for tool in filtered_tools:
                tool_frame = tk.Frame(cat_frame, bg=self.colors['bg_secondary'])
                tool_frame.pack(fill="x", padx=10, pady=2)
                
                var = tk.IntVar()
                
                # Check if tool exists
                exists = os.path.exists(tool['path'])
                status_icon = "✓" if exists else "✗"
                status_color = self.colors['primary'] if exists else self.colors['danger']
                
                cb = tk.Checkbutton(
                    tool_frame,
                    text=f"  {tool['name']}",
                    variable=var,
                    bg=self.colors['bg_secondary'],
                    fg=self.colors['text'],
                    font=('Consolas', 9),
                    activebackground=self.colors['bg_tertiary'],
                    activeforeground=self.colors['primary'],
                    selectcolor=self.colors['bg_tertiary'],
                    state='normal' if exists else 'disabled'
                )
                cb.pack(side="left")
                
                # Status indicator
                status_label = tk.Label(
                    tool_frame,
                    text=f" {status_icon}",
                    fg=status_color,
                    bg=self.colors['bg_secondary'],
                    font=('Consolas', 9)
                )
                status_label.pack(side="left")
                
                # Path label
                path_label = tk.Label(
                    tool_frame,
                    text=f" ({tool['path']})",
                    fg=self.colors['text_dim'],
                    bg=self.colors['bg_secondary'],
                    font=('Consolas', 8)
                )
                path_label.pack(side="left")
                
                cb.var = var
                cb.tool = tool
                self.checkboxes[category].append(cb)
        
        self.update_counter()
        
    def update_counter(self):
        """Update tool counter display"""
        total = sum(len(tools) for tools in self.checkboxes.values())
        selected = sum(1 for tools in self.checkboxes.values() 
                      for cb in tools if cb.var.get() == 1)
        self.counter_label.config(text=f"[{selected}/{total}]")
        
    def filter_tools(self, *args):
        self.populate_tools()
        
    def select_all(self):
        for category in self.checkboxes:
            for cb in self.checkboxes[category]:
                if cb['state'] == 'normal':
                    cb.var.set(1)
        self.update_counter()
        self.status_var.set("[ALL TOOLS SELECTED]")
        
    def clear_selection(self):
        for category in self.checkboxes:
            for cb in self.checkboxes[category]:
                cb.var.set(0)
        self.update_counter()
        self.status_var.set("[SELECTION CLEARED]")
        
    def add_custom_tool(self):
        """Dialog to add custom tool"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Add Custom Tool")
        dialog.geometry("500x250")
        dialog.configure(bg=self.colors['bg'])
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Category selection
        tk.Label(dialog, text="Category:", bg=self.colors['bg'], 
                fg=self.colors['text'], font=('Consolas', 10)).grid(row=0, column=0, padx=10, pady=10, sticky="w")
        
        cat_var = tk.StringVar(value=list(self.tools.keys())[0])
        cat_menu = ttk.Combobox(dialog, textvariable=cat_var, values=list(self.tools.keys()) + ["[New Category]"])
        cat_menu.grid(row=0, column=1, padx=10, pady=10, sticky="ew")
        
        # New category entry
        tk.Label(dialog, text="New Category:", bg=self.colors['bg'], 
                fg=self.colors['text'], font=('Consolas', 10)).grid(row=1, column=0, padx=10, pady=5, sticky="w")
        new_cat_entry = ttk.Entry(dialog, font=('Consolas', 10))
        new_cat_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")
        
        # Tool name
        tk.Label(dialog, text="Tool Name:", bg=self.colors['bg'], 
                fg=self.colors['text'], font=('Consolas', 10)).grid(row=2, column=0, padx=10, pady=5, sticky="w")
        name_entry = ttk.Entry(dialog, font=('Consolas', 10))
        name_entry.grid(row=2, column=1, padx=10, pady=5, sticky="ew")
        
        # Tool path
        tk.Label(dialog, text="Tool Path:", bg=self.colors['bg'], 
                fg=self.colors['text'], font=('Consolas', 10)).grid(row=3, column=0, padx=10, pady=5, sticky="w")
        path_entry = ttk.Entry(dialog, font=('Consolas', 10))
        path_entry.grid(row=3, column=1, padx=10, pady=5, sticky="ew")
        
        def browse_exe():
            path = filedialog.askopenfilename(filetypes=[("Executable", "*.exe"), ("All Files", "*.*")])
            if path:
                path_entry.delete(0, tk.END)
                path_entry.insert(0, path)
        
        ttk.Button(dialog, text="Browse", command=browse_exe).grid(row=3, column=2, padx=5)
        
        dialog.grid_columnconfigure(1, weight=1)
        
        # Buttons
        button_frame = ttk.Frame(dialog, style='Main.TFrame')
        button_frame.grid(row=4, column=0, columnspan=3, pady=20)
        
        def add_tool():
            category = new_cat_entry.get() if cat_var.get() == "[New Category]" else cat_var.get()
            name = name_entry.get()
            path = path_entry.get()
            
            if not category or not name or not path:
                messagebox.showwarning("Missing Info", "Please fill all fields")
                return
            
            if category not in self.tools:
                self.tools[category] = []
            
            self.tools[category].append({"name": name, "path": path})
            self.populate_tools()
            self.status_var.set(f"[TOOL ADDED: {name}]")
            dialog.destroy()
        
        ttk.Button(button_frame, text="ADD", command=add_tool).pack(side="left", padx=5)
        ttk.Button(button_frame, text="CANCEL", command=dialog.destroy).pack(side="left", padx=5)
        
    def browse_directory(self):
        directory = filedialog.askdirectory()
        if directory:
            self.output_var.set(directory)
            self.status_var.set(f"[OUTPUT: {directory}]")
            
    def create_shortcut(self, folder_path, tool_name, tool_path):
        try:
            if not os.path.exists(tool_path):
                raise FileNotFoundError(f"Tool not found: {tool_path}")
                
            shell = win32com.client.Dispatch("WScript.Shell")
            shortcut_path = os.path.join(folder_path, f"{tool_name}.lnk")
            shortcut = shell.CreateShortcut(shortcut_path)
            shortcut.TargetPath = tool_path
            shortcut.WorkingDirectory = os.path.dirname(tool_path)
            shortcut.IconLocation = f"{tool_path},0"
            shortcut.Description = f"Shortcut to {tool_name}"
            shortcut.save()
            return True
        except Exception as e:
            print(f"Error creating shortcut for {tool_name}: {str(e)}")
            return False
            
    def generate_shortcuts(self):
        selected_tools = self.collect_selected_tools()
        
        if not selected_tools:
            messagebox.showwarning("No Selection", "Please select at least one tool")
            self.status_var.set("[ERROR: NO TOOLS SELECTED]")
            return
            
        output_dir = self.output_var.get()
        
        # Create output directory
        try:
            Path(output_dir).mkdir(parents=True, exist_ok=True)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create output directory: {str(e)}")
            self.status_var.set("[ERROR: DIRECTORY CREATION FAILED]")
            return
        
        # Show progress
        self.progress.grid(row=6, column=0, pady=10)
        total_tools = sum(len(tools) for tools in selected_tools.values())
        self.progress['maximum'] = total_tools
        self.progress['value'] = 0
        
        success_count = 0
        failed_tools = []
        
        for category, tools_list in selected_tools.items():
            category_folder = os.path.join(output_dir, category)
            Path(category_folder).mkdir(parents=True, exist_ok=True)
            
            for tool in tools_list:
                if self.create_shortcut(category_folder, tool["name"], tool["path"]):
                    success_count += 1
                else:
                    failed_tools.append(tool["name"])
                
                self.progress['value'] += 1
                self.root.update_idletasks()
        
        self.progress.grid_remove()
        
        # Show results
        if failed_tools:
            msg = f"Created {success_count}/{total_tools} shortcuts.\nFailed: {', '.join(failed_tools)}"
            messagebox.showwarning("Partial Success", msg)
        else:
            messagebox.showinfo("Success", f"All {success_count} shortcuts created successfully!")
        
        self.status_var.set(f"[COMPLETED: {success_count}/{total_tools} SHORTCUTS]")
        
    def collect_selected_tools(self):
        selected_tools = {}
        for category in self.checkboxes:
            selected_in_cat = []
            for cb in self.checkboxes.get(category, []):
                if cb.var.get() == 1:
                    selected_in_cat.append(cb.tool)
                    # Update counter after each selection
                    self.update_counter()
            if selected_in_cat:
                selected_tools[category] = selected_in_cat
        return selected_tools
        
    def save_config(self):
        config = {
            "output_dir": self.output_var.get(),
            "tools": self.tools,
            "selected_tools": {
                category: [cb.tool["name"] for cb in self.checkboxes.get(category, []) 
                          if cb.var.get() == 1]
                for category in self.tools.keys()
            }
        }
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json")],
            initialfile="hacker_tools_config.json"
        )
        
        if file_path:
            try:
                with open(file_path, 'w') as f:
                    json.dump(config, f, indent=2)
                self.status_var.set(f"[CONFIG SAVED: {os.path.basename(file_path)}]")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save config: {str(e)}")
                self.status_var.set("[ERROR: CONFIG SAVE FAILED]")
                
    def load_config(self):
        file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        
        if file_path:
            try:
                with open(file_path, 'r') as f:
                    config = json.load(f)
                
                self.output_var.set(config.get("output_dir", self.output_var.get()))
                
                # Load tools if present
                if "tools" in config:
                    self.tools = config["tools"]
                    self.populate_tools()
                
                # Load selections
                selected = config.get("selected_tools", {})
                for category in self.checkboxes:
                    for cb in self.checkboxes[category]:
                        cb.var.set(1 if cb.tool["name"] in selected.get(category, []) else 0)
                
                self.update_counter()
                self.status_var.set(f"[CONFIG LOADED: {os.path.basename(file_path)}]")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load config: {str(e)}")
                self.status_var.set("[ERROR: CONFIG LOAD FAILED]")
                
    def load_auto_config(self):
        """Load config from default location if exists"""
        auto_config = os.path.join(os.path.dirname(__file__), "auto_config.json")
        if os.path.exists(auto_config):
            try:
                with open(auto_config, 'r') as f:
                    config = json.load(f)
                    if "tools" in config:
                        self.tools = config["tools"]
                        self.populate_tools()
                self.status_var.set("[AUTO-CONFIG LOADED]")
            except:
                pass

def main():
    root = tk.Tk()
    
    # Set window icon if available
    try:
        root.iconbitmap(default='hacker.ico')
    except:
        pass
    
    app = ShortcutGeneratorApp(root)
    
    # Center window on screen
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{width}x{height}+{x}+{y}')
    
    # Handle cleanup on close
    def on_closing():
        app.animation_running = False
        root.destroy()
    
    root.protocol("WM_DELETE_WINDOW", on_closing)
    
    try:
        root.mainloop()
    except KeyboardInterrupt:
        on_closing()

if __name__ == "__main__":
    main()